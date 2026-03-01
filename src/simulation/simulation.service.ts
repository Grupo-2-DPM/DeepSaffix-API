// simulation.service.ts
import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSimulacroDto } from './dto/create-simulacro.dto';
import { UpdateSimulacroDto } from './dto/update-simulacro.dto';
import { CreateAttemptDto } from './dto/create-attempt.dto';
import { SubmitAnswersDto } from './dto/submit-answers.dto';

@Injectable()
export class SimulationService {
  constructor(private prisma: PrismaService) {}

  // ========================
  // MÉTODOS PARA SIMULACROS
  // ========================

  async create(createDto: CreateSimulacroDto) {
    try {
      // 1. Crear el simulacro base
      const simulacro = await this.prisma.simulacro.create({
        data: {
          nombre: createDto.nombre,
          descripcion: createDto.descripcion,
          duracion_minutos: createDto.duracion_minutos,
        },
      });

      // 2. Si hay pool o preguntaIds, asociar preguntas
      let preguntaIds: number[] = [];

      if (createDto.pool) {
        // Caso 1: Selección aleatoria desde pool
        preguntaIds = await this.getRandomQuestionsFromPool(createDto.pool);
      } else if (createDto.preguntaIds?.length) {
        // Caso 2: IDs de preguntas específicas
        preguntaIds = createDto.preguntaIds;
      }

      // 3. Asociar preguntas al simulacro si las hay
      if (preguntaIds.length > 0) {
        await this.associateQuestionsToSimulacro(
          simulacro.id_simulacro,
          preguntaIds,
        );
      }

      // 4. Retornar simulacro con sus preguntas
      return this.findOne(simulacro.id_simulacro);
    } catch (error) {
      throw new InternalServerErrorException(
        `Error creando simulacro: ${error.message}`,
      );
    }
  }

  async findAll() {
    return this.prisma.simulacro.findMany({
      include: {
        simulacroPreguntas: {
          include: {
            pregunta: {
              include: {
                opciones: true,
              },
            },
          },
          orderBy: {
            orden: 'asc',
          },
        },
      },
    });
  }

  async findOne(id: number) {
    const simulacro = await this.prisma.simulacro.findUnique({
      where: { id_simulacro: id },
      include: {
        simulacroPreguntas: {
          include: {
            pregunta: {
              include: {
                opciones: true,
              },
            },
          },
          orderBy: {
            orden: 'asc',
          },
        },
      },
    });

    if (!simulacro) {
      throw new NotFoundException(`Simulacro con ID ${id} no encontrado`);
    }

    return simulacro;
  }

  async update(id: number, updateDto: UpdateSimulacroDto) {
    // Verificar que existe
    await this.findOne(id);

    try {
      return await this.prisma.$transaction(async (tx) => {
        // 1. Actualizar datos básicos del simulacro
        await tx.simulacro.update({
          where: { id_simulacro: id },
          data: {
            nombre: updateDto.nombre,
            descripcion: updateDto.descripcion,
            duracion_minutos: updateDto.duracion_minutos,
          },
        });

        // 2. Si hay nuevas preguntas, reemplazar las existentes
        if (updateDto.pool || updateDto.preguntaIds) {
          // Eliminar asociaciones actuales
          await tx.simulacroPregunta.deleteMany({
            where: { id_simulacro: id },
          });

          let preguntaIds: number[] = [];

          if (updateDto.pool) {
            preguntaIds = await this.getRandomQuestionsFromPool(updateDto.pool);
          } else if (updateDto.preguntaIds?.length) {
            preguntaIds = updateDto.preguntaIds;
          }

          if (preguntaIds.length > 0) {
            await this.associateQuestionsToSimulacro(id, preguntaIds, tx);
          }
        }

        return this.findOne(id);
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `Error actualizando simulacro: ${error.message}`,
      );
    }
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.simulacro.delete({
      where: { id_simulacro: id },
    });
  }

  // ========================
  // MÉTODOS PARA INTENTOS
  // ========================

  async startAttempt(createDto: CreateAttemptDto, simulacroId: number) {
    // Verificar usuario
    const usuario = await this.prisma.usuario.findUnique({
      where: { id_usuario: createDto.id_usuario },
    });
    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Verificar simulacro
    const simulacro = await this.prisma.simulacro.findUnique({
      where: { id_simulacro: simulacroId },
      include: {
        simulacroPreguntas: true,
      },
    });
    if (!simulacro) {
      throw new NotFoundException('Simulacro no encontrado');
    }

    if (simulacro.simulacroPreguntas.length === 0) {
      throw new BadRequestException(
        'El simulacro no tiene preguntas asociadas',
      );
    }

    try {
      const intento = await this.prisma.intentoSimulacro.create({
        data: {
          id_usuario: createDto.id_usuario,
          id_simulacro: simulacroId,
          fecha_inicio: new Date(),
        },
      });

      return intento;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error creando intento: ${error.message}`,
      );
    }
  }

  async submitAnswers(intentoId: number, dto: SubmitAnswersDto) {
    const intento = await this.prisma.intentoSimulacro.findUnique({
      where: { id_intento: intentoId },
      include: {
        simulacro: true,
      },
    });

    if (!intento) {
      throw new NotFoundException('Intento no encontrado');
    }

    // Validaciones
    if (intento.fecha_fin) {
      throw new BadRequestException('Este intento ya ha sido finalizado');
    }

    const tiempoTranscurrido =
      (new Date().getTime() - intento.fecha_inicio.getTime()) / 60000;
    if (tiempoTranscurrido > intento.simulacro.duracion_minutos) {
      throw new BadRequestException('Se ha excedido el tiempo del simulacro');
    }

    // Validar que todas las respuestas correspondan a preguntas del intento
    const simulacroPreguntaIds = dto.respuestas.map(
      (r) => r.id_simulacro_pregunta,
    );

    const preguntasValidas = await this.prisma.simulacroPregunta.count({
      where: {
        id_simulacro_pregunta: { in: simulacroPreguntaIds },
        id_simulacro: intento.id_simulacro,
      },
    });

    if (preguntasValidas !== simulacroPreguntaIds.length) {
      throw new BadRequestException(
        'Algunas preguntas no pertenecen a este simulacro',
      );
    }

    // Validar que las opciones existan
    const opcionIds = dto.respuestas.map((r) => r.id_opcion);
    const opcionesValidas = await this.prisma.opcionPregunta.count({
      where: { id_opcion: { in: opcionIds } },
    });

    if (opcionesValidas !== opcionIds.length) {
      throw new NotFoundException('Algunas opciones no existen');
    }

    // Guardar respuestas
    try {
      await this.prisma.$transaction(
        dto.respuestas.map((respuesta) =>
          this.prisma.respuesta.upsert({
            where: {
              id_intento_id_simulacro_pregunta: {
                id_intento: intentoId,
                id_simulacro_pregunta: respuesta.id_simulacro_pregunta,
              },
            },
            update: {
              id_opcion: respuesta.id_opcion,
            },
            create: {
              id_intento: intentoId,
              id_simulacro_pregunta: respuesta.id_simulacro_pregunta,
              id_opcion: respuesta.id_opcion,
            },
          }),
        ),
      );

      return { message: 'Respuestas guardadas exitosamente' };
    } catch (error) {
      throw new InternalServerErrorException(
        `Error guardando respuestas: ${error.message}`,
      );
    }
  }

  async finishAttempt(intentoId: number) {
    const intento = await this.prisma.intentoSimulacro.findUnique({
      where: { id_intento: intentoId },
      include: {
        simulacro: true,
        respuestas: {
          include: {
            opcion: true,
          },
        },
      },
    });

    if (!intento) {
      throw new NotFoundException(`Intento ${intentoId} no encontrado`);
    }

    if (intento.fecha_fin) {
      throw new BadRequestException(
        'Este intento ya fue finalizado previamente',
      );
    }

    const fecha_fin = new Date();
    let tiempoUtilizado = Math.round(
      (fecha_fin.getTime() - intento.fecha_inicio.getTime()) / 60000,
    );

    // Limitar al tiempo máximo del simulacro
    if (tiempoUtilizado > intento.simulacro.duracion_minutos) {
      tiempoUtilizado = intento.simulacro.duracion_minutos;
    }

    // Calcular puntaje
    const respuestasCorrectas = intento.respuestas.filter(
      (r) => r.opcion.es_correcta,
    ).length;

    const intentoActualizado = await this.prisma.intentoSimulacro.update({
      where: { id_intento: intentoId },
      data: {
        fecha_fin,
        tiempo_utilizado: tiempoUtilizado,
        puntaje_total: respuestasCorrectas,
      },
      include: {
        respuestas: {
          include: {
            opcion: {
              include: {
                pregunta: true,
              },
            },
          },
        },
        usuario: true,
        simulacro: true,
      },
    });

    return intentoActualizado;
  }

  async getAttempt(intentoId: number) {
    const intento = await this.prisma.intentoSimulacro.findUnique({
      where: { id_intento: intentoId },
      include: {
        respuestas: {
          include: {
            opcion: {
              include: {
                pregunta: true,
              },
            },
          },
        },
        usuario: true,
        simulacro: {
          include: {
            simulacroPreguntas: {
              include: {
                pregunta: {
                  include: {
                    opciones: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!intento) {
      throw new NotFoundException(`Intento ${intentoId} no encontrado`);
    }

    return intento;
  }

  async findAttemptsByUser(userId: number) {
    return this.prisma.intentoSimulacro.findMany({
      where: { id_usuario: userId },
      include: {
        simulacro: true,
        respuestas: {
          include: {
            opcion: true,
          },
        },
      },
      orderBy: { fecha_inicio: 'desc' },
    });
  }

  // ========================
  // MÉTODOS PRIVADOS UTILITARIOS
  // ========================

  private async getRandomQuestionsFromPool(pool: {
    cantidad: number;
    nivel_dificultad?: string;
    tipo_pregunta?: string;
  }): Promise<number[]> {
    const { cantidad, nivel_dificultad, tipo_pregunta } = pool;

    if (cantidad <= 0) {
      throw new BadRequestException('La cantidad debe ser mayor a 0');
    }

    // Construir filtros
    const where: any = {};

    if (nivel_dificultad) {
      where.nivel_dificultad = nivel_dificultad;
    }

    if (tipo_pregunta) {
      where.tipo_pregunta = tipo_pregunta;
    }

    // Obtener IDs de preguntas que cumplan los criterios
    const preguntas = await this.prisma.pregunta.findMany({
      where,
      select: { id_pregunta: true },
    });

    if (preguntas.length < cantidad) {
      throw new NotFoundException(
        `No hay suficientes preguntas (${preguntas.length} disponibles, se requieren ${cantidad})`,
      );
    }

    // Selección aleatoria
    const shuffled = preguntas.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, cantidad).map((p) => p.id_pregunta);
  }

  private async associateQuestionsToSimulacro(
    simulacroId: number,
    preguntaIds: number[],
    tx?: any,
  ) {
    const prisma = tx || this.prisma;

    const simulacroPreguntasData = preguntaIds.map((id_pregunta, index) => ({
      id_simulacro: simulacroId,
      id_pregunta,
      orden: index + 1,
    }));

    await prisma.simulacroPregunta.createMany({
      data: simulacroPreguntasData,
      skipDuplicates: true,
    });
  }
}
