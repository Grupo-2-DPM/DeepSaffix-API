import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSimulacroDto } from './dto/create-simulacro.dto';
import { CreateAttemptDto } from './dto/create-attempt.dto';
import { SubmitAnswersDto } from './dto/submit-answers.dto';

@Injectable()
export class SimulationService {
  constructor(private prisma: PrismaService) {}

  // Método para crear un nuevo simulacro
  async create(createDto: CreateSimulacroDto) {
    // Si se proporciona un pool, tomar preguntas existentes de la base de datos
    // en vez de crear preguntas nuevas
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const pool: any = (createDto as any).pool;

    if (pool && (!createDto.preguntas || createDto.preguntas.length === 0)) {
      const cantidad = Number(pool.cantidad) || 0;
      if (cantidad <= 0) throw new InternalServerErrorException('Cantidad inválida en pool');

      const whereClauses: string[] = [];
      if (pool.nivel_dificultad) whereClauses.push(`nivel_dificultad = '${pool.nivel_dificultad}'`);
      if (pool.tipo_pregunta) whereClauses.push(`tipo_pregunta = '${pool.tipo_pregunta}'`);
      const whereSql = whereClauses.length ? `WHERE ${whereClauses.join(' AND ')}` : '';

      // Selección aleatoria de preguntas usando SQL raw (Postgres)
      const raw = await this.prisma.$queryRawUnsafe(`SELECT id_pregunta FROM \"Pregunta\" ${whereSql} ORDER BY random() LIMIT ${cantidad}`) as Array<{ id_pregunta: number }>;
      const ids: number[] = raw.map((r) => r.id_pregunta).filter(Boolean);
      if (ids.length < cantidad) throw new NotFoundException('No hay suficientes preguntas en el pool que cumplan los criterios');

      try {
        const result = await this.prisma.$transaction(async (tx) => {
          const s = await tx.simulacro.create({
            data: {
              nombre: createDto.nombre,
              descripcion: createDto.descripcion,
              duracion_minutos: createDto.duracion_minutos,
            },
          });

          await tx.pregunta.updateMany({
            where: { id_pregunta: { in: ids } },
            data: { id_simulacro: s.id_simulacro },
          });

          return tx.simulacro.findUnique({
            where: { id_simulacro: s.id_simulacro },
            include: { preguntas: { include: { opciones: true } } },
          });
        });

        return result;
      } catch (e) {
        throw new InternalServerErrorException('Error creando simulacro desde pool: ' + e);
      }
    }

    // Si se proporcionan preguntas explícitas, crear simulacro con preguntas nuevas
    const simulacro = await this.prisma.simulacro.create({
      data: {
        nombre: createDto.nombre,
        descripcion: createDto.descripcion,
        duracion_minutos: createDto.duracion_minutos,
        preguntas: createDto.preguntas
          ? {
              create: createDto.preguntas.map((p) => ({
                enunciado: p.enunciado,
                tipo_pregunta: p.tipo_pregunta,
                nivel_dificultad: p.nivel_dificultad,
                opciones: {
                  create: p.opciones.map((o) => ({
                    texto_opcion: o.texto_opcion,
                    es_correcta: o.es_correcta,
                  })),
                },
              })),
            }
          : undefined,
      },
      include: {
        preguntas: { include: { opciones: true } },
      },
    });

    return simulacro;
  }

  // Método para listar todos los simulacros
  async findAll() {
    return this.prisma.simulacro.findMany({
      include: { preguntas: { include: { opciones: true } } },
    });
  }

  // Método para obtener un simulacro por su ID
  async findOne(id: number) {
    return this.prisma.simulacro.findUnique({
      where: { id_simulacro: id },
      include: { preguntas: { include: { opciones: true } } },
    });
  }

  // Método para eliminar un simulacro por su ID
  async remove(id: number) {
    const existing = await this.prisma.simulacro.findUnique({
      where: { id_simulacro: id },
    });
    if (!existing)
      throw new NotFoundException(`Simulacro con ID ${id} no encontrado`);

    await this.prisma.simulacro.delete({ where: { id_simulacro: id } });
    return;
  }

  // Método para actualizar un simulacro (metadata y reemplazar preguntas)
  async update(id: number, updateDto: any) {
    const existing = await this.prisma.simulacro.findUnique({ where: { id_simulacro: id } });
    if (!existing) throw new NotFoundException(`Simulacro con ID ${id} no encontrado`);

    // Si se proporciona pool, reasignar preguntas desde el pool
    const pool: any = updateDto.pool;
    if (pool && (!updateDto.preguntas || updateDto.preguntas.length === 0)) {
      const cantidad = Number(pool.cantidad) || 0;
      if (cantidad <= 0) throw new InternalServerErrorException('Cantidad inválida en pool');

      const whereClauses: string[] = [];
      if (pool.nivel_dificultad) whereClauses.push(`nivel_dificultad = '${pool.nivel_dificultad}'`);
      if (pool.tipo_pregunta) whereClauses.push(`tipo_pregunta = '${pool.tipo_pregunta}'`);
      const whereSql = whereClauses.length ? `WHERE ${whereClauses.join(' AND ')}` : '';

      const raw = await this.prisma.$queryRawUnsafe(`SELECT id_pregunta FROM \"Pregunta\" ${whereSql} ORDER BY random() LIMIT ${cantidad}`) as Array<{ id_pregunta: number }>;
      const ids: number[] = raw.map((r) => r.id_pregunta).filter(Boolean);
      if (ids.length < cantidad) throw new NotFoundException('No hay suficientes preguntas en el pool que cumplan los criterios');

      try {
        const result = await this.prisma.$transaction(async (tx) => {
          // eliminar preguntas actuales y sus opciones
          const existingPregs = await tx.pregunta.findMany({ where: { id_simulacro: id } });
          const existingIds = existingPregs.map((p) => p.id_pregunta);
          if (existingIds.length) {
            await tx.opcionPregunta.deleteMany({ where: { id_pregunta: { in: existingIds } } });
            await tx.pregunta.deleteMany({ where: { id_simulacro: id } });
          }

          // crear metadatos
          await tx.simulacro.update({ where: { id_simulacro: id }, data: { nombre: updateDto.nombre ?? existing.nombre, descripcion: updateDto.descripcion ?? existing.descripcion, duracion_minutos: updateDto.duracion_minutos ?? existing.duracion_minutos } });

          // reasignar preguntas seleccionadas del pool al simulacro
          await tx.pregunta.updateMany({ where: { id_pregunta: { in: ids } }, data: { id_simulacro: id } });

          return tx.simulacro.findUnique({ where: { id_simulacro: id }, include: { preguntas: { include: { opciones: true } } } });
        });
        return result;
      } catch (e) {
        throw new InternalServerErrorException('Error actualizando simulacro desde pool: ' + e);
      }
    }

    // Si se proporcionan preguntas explícitas, reemplazar preguntas existentes
    if (updateDto.preguntas && updateDto.preguntas.length > 0) {
      try {
        const result = await this.prisma.$transaction(async (tx) => {
          const existingPregs = await tx.pregunta.findMany({ where: { id_simulacro: id } });
          const existingIds = existingPregs.map((p) => p.id_pregunta);
          if (existingIds.length) {
            await tx.opcionPregunta.deleteMany({ where: { id_pregunta: { in: existingIds } } });
            await tx.pregunta.deleteMany({ where: { id_simulacro: id } });
          }

          await tx.simulacro.update({ where: { id_simulacro: id }, data: { nombre: updateDto.nombre ?? existing.nombre, descripcion: updateDto.descripcion ?? existing.descripcion, duracion_minutos: updateDto.duracion_minutos ?? existing.duracion_minutos } });

          for (const p of updateDto.preguntas) {
            await tx.pregunta.create({ data: { enunciado: p.enunciado, tipo_pregunta: p.tipo_pregunta, nivel_dificultad: p.nivel_dificultad, id_simulacro: id, opciones: { create: p.opciones.map((o: any) => ({ texto_opcion: o.texto_opcion, es_correcta: o.es_correcta })) } } });
          }

          return tx.simulacro.findUnique({ where: { id_simulacro: id }, include: { preguntas: { include: { opciones: true } } } });
        });

        return result;
      } catch (e) {
        throw new InternalServerErrorException('Error actualizando simulacro: ' + e);
      }
    }

    // Si solo se actualizan metadatos
    return this.prisma.simulacro.update({ where: { id_simulacro: id }, data: { nombre: updateDto.nombre ?? existing.nombre, descripcion: updateDto.descripcion ?? existing.descripcion, duracion_minutos: updateDto.duracion_minutos ?? existing.duracion_minutos }, include: { preguntas: { include: { opciones: true } } } });
  }

  // Método para iniciar un nuevo intento de simulacro
  async startAttempt(createDto: CreateAttemptDto) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const id_simulacro = createDto['id_simulacro'];

    const usuario = await this.prisma.usuario.findUnique({
      where: { id_usuario: createDto.id_usuario },
    });
    if (!usuario) throw new NotFoundException('Usuario no encontrado');

    const simulacro = await this.prisma.simulacro.findUnique({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      where: { id_simulacro },
    });
    if (!simulacro) throw new NotFoundException('Simulacro no encontrado');

    try {
      const intento = await this.prisma.intentoSimulacro.create({
        data: {
          id_usuario: createDto.id_usuario,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          id_simulacro: id_simulacro,
          fecha_inicio: new Date(),
        },
      });
      return intento;
    } catch (e) {
      throw new InternalServerErrorException('Error creando intento' + e);
    }
  }

  // Método para enviar respuestas de un intento
  async submitAnswers(id_intento: number, dto: SubmitAnswersDto) {
    const intento = await this.prisma.intentoSimulacro.findUnique({
      where: { id_intento },
      include: { simulacro: true },
    });

    if (!intento) {
      throw new NotFoundException('Intento no encontrado');
    }

    // Validación: intento ya finalizado
    if (intento.fecha_fin) {
      throw new BadRequestException(
        'Este intento ya ha sido finalizado, lo sentimos',
      );
    }

    // Validación: tiempo máximo del simulacro
    const tiempoTranscurrido =
      (new Date().getTime() - intento.fecha_inicio.getTime()) / 60000;
    if (tiempoTranscurrido > intento.simulacro.duracion_minutos) {
      throw new BadRequestException('Se ha excedido el tiempo del simulacro');
    }

    // Validar que todas las opciones existan
    const opcionIds = dto.selected_option_ids;
    const opcionesCount = await this.prisma.opcionPregunta.count({
      where: { id_opcion: { in: opcionIds } },
    });
    if (opcionesCount !== opcionIds.length) {
      throw new NotFoundException('Algunas opciones no existen');
    }

    // Preparar datos para insertar
    const answersData = opcionIds.map((id_opcion) => ({
      id_intento: id_intento,
      id_opcion,
    }));

    await this.prisma.respuesta.createMany({
      data: answersData,
      skipDuplicates: true,
    });

    return { inserted: answersData.length };
  }

  // Método para finalizar un intento de simulacro
  async finishAttempt(id_intento: number) {
    const intento = await this.prisma.intentoSimulacro.findUnique({
      where: { id_intento },
      include: { simulacro: true },
    });

    if (!intento)
      throw new NotFoundException(`Intento ${id_intento} no encontrado`);

    // Validación: no finalizar dos veces
    if (intento.fecha_fin) {
      throw new BadRequestException(
        'Este intento ya fue finalizado previamente',
      );
    }

    const fecha_fin = new Date();
    // Calcular tiempo usado pero no más que la duración máxima
    let tiempoMin = Math.round(
      (fecha_fin.getTime() - intento.fecha_inicio.getTime()) / 60000,
    );
    if (tiempoMin > intento.simulacro.duracion_minutos) {
      tiempoMin = intento.simulacro.duracion_minutos;
    }

    const correctCount = await this.prisma.respuesta.count({
      where: { id_intento, opcion: { es_correcta: true } },
    });

    await this.prisma.intentoSimulacro.update({
      where: { id_intento },
      data: {
        fecha_fin,
        tiempo_utilizado: tiempoMin,
        puntaje_total: correctCount,
      },
    });

    return this.prisma.intentoSimulacro.findUnique({
      where: { id_intento },
      include: {
        respuestas: { include: { opcion: true } },
        usuario: true,
        simulacro: true,
      },
    });
  }
  // Método para obtener un intento por su ID
  async getAttempt(id_intento: number) {
    return this.prisma.intentoSimulacro.findUnique({
      where: { id_intento },
      include: {
        respuestas: { include: { opcion: true } },
        usuario: true,
        simulacro: true,
      },
    });
  }

  async findAttemptsById(id_usuario: number) {
    return this.prisma.intentoSimulacro.findMany({
      where: { id_usuario },
      orderBy: { fecha_inicio: 'desc' },
      include: { simulacro: true, respuestas: { include: { opcion: true } } },
    });
  }
  // Método para obtener los intentos realizados por un usuario
  async findAttemptsByUser(userId: number) {
    return this.prisma.intentoSimulacro.findMany({
      where: { id_usuario: userId },
      include: { simulacro: true },
    });
  }
}
