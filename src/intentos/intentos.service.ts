import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateIntentoDto } from './dto/create-intento.dto';
import { SubmitAnswersDto } from './dto/submit-answer-dto';

@Injectable()
export class IntentosService {
  constructor(private prisma: PrismaService) {}

  async startAttempt(createDto: CreateIntentoDto) {
    const { id_usuario, id_simulacro } = createDto;

    // Verificar usuario
    const usuario = await this.prisma.usuario.findUnique({
      where: { id_usuario },
    });

    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Verificar simulacro
    const simulacro = await this.prisma.simulacro.findUnique({
      where: { id_simulacro },
      include: { simulacroPreguntas: true },
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
      return await this.prisma.intentoSimulacro.create({
        data: {
          id_usuario,
          id_simulacro,
          fecha_inicio: new Date(),
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `Error creando intento: ${error.message}`,
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

    if (tiempoUtilizado > intento.simulacro.duracion_minutos) {
      tiempoUtilizado = intento.simulacro.duracion_minutos;
    }

    const respuestasCorrectas = intento.respuestas.filter(
      (r) => r.opcion.es_correcta,
    ).length;

    return await this.prisma.intentoSimulacro.update({
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

    if (intento.fecha_fin) {
      throw new BadRequestException('Este intento ya ha sido finalizado');
    }

    const tiempoTranscurrido =
      (new Date().getTime() - intento.fecha_inicio.getTime()) / 60000;

    if (tiempoTranscurrido > intento.simulacro.duracion_minutos) {
      throw new BadRequestException('Se ha excedido el tiempo del simulacro');
    }

    // Validar preguntas
    const simulacroPreguntaIds = dto.respuestas.map(
      (r) => r.id_simulacro_pregunta,
    );

    const preguntasValidas = await this.prisma.simulacroPregunta.count({
      where: {
        id_simulacro_pregunta: {
          in: simulacroPreguntaIds,
        },
        id_simulacro: intento.id_simulacro,
      },
    });

    if (preguntasValidas !== simulacroPreguntaIds.length) {
      throw new BadRequestException(
        'Algunas preguntas no pertenecen a este simulacro',
      );
    }

    // Validar opciones
    const opcionIds = dto.respuestas.map((r) => r.id_opcion);

    const opcionesValidas = await this.prisma.opcionPregunta.count({
      where: {
        id_opcion: { in: opcionIds },
      },
    });

    if (opcionesValidas !== opcionIds.length) {
      throw new NotFoundException('Algunas opciones no existen');
    }

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

      return {
        message: 'Respuestas guardadas exitosamente',
      };
    } catch (error) {
      throw new InternalServerErrorException(
        `Error guardando respuestas: ${error.message}`,
      );
    }
  }
  async findAttemptsByUser(userId: number) {
    // Verificar que el usuario exista
    const usuario = await this.prisma.usuario.findUnique({
      where: { id_usuario: userId },
    });

    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }

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
}
