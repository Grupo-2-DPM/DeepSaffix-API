import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSimulacroDto } from './dto/create-simulacro.dto';
import { CreateAttemptDto } from './dto/create-attempt.dto';
import { SubmitAnswersDto } from './dto/submit-answers.dto';

@Injectable()
export class SimulationService {
	constructor(private prisma: PrismaService) {}

	// Método para crear un nuevo simulacro
	async create(createDto: CreateSimulacroDto) {
		const simulacro = await this.prisma.simulacro.create({
			data: {
				nombre: createDto.nombre,
				descripcion: createDto.descripcion,
				duracion_minutos: createDto.duracion_minutos,
				preguntas: {
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
				},
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
		const existing = await this.prisma.simulacro.findUnique({ where: { id_simulacro: id } });
		if (!existing) throw new NotFoundException(`Simulacro con ID ${id} no encontrado`);

		await this.prisma.simulacro.delete({ where: { id_simulacro: id } });
		return;
	}

	// Método para iniciar un nuevo intento de simulacro
	async startAttempt(createDto: CreateAttemptDto) {
		const id_simulacro = createDto['id_simulacro'];

		const usuario = await this.prisma.usuario.findUnique({ where: { id_usuario: createDto.id_usuario } });
		if (!usuario) throw new NotFoundException('Usuario no encontrado');

		const simulacro = await this.prisma.simulacro.findUnique({ where: { id_simulacro } });
		if (!simulacro) throw new NotFoundException('Simulacro no encontrado');

		try {
			const intento = await this.prisma.intentoSimulacro.create({
				data: {
					id_usuario: createDto.id_usuario,
					id_simulacro: id_simulacro,
					fecha_inicio: new Date(),
				},
			});
			return intento;
		} catch (error) {
			throw new InternalServerErrorException('Error creando intento');
		}
	}

	// Método para enviar respuestas de un intento
	async submitAnswers(id_intento: number, dto: SubmitAnswersDto) {
		const intento = await this.prisma.intentoSimulacro.findUnique({ where: { id_intento } });
		if (!intento) {
			throw new NotFoundException('Intento no encontrado');
		}

		const opcionIds = dto.selected_option_ids;
		const opcionesCount = await this.prisma.opcionPregunta.count({ where: { id_opcion: { in: opcionIds } } });
		if (opcionesCount !== opcionIds.length) {
			throw new NotFoundException('Algunas opciones no existen');
		}

		const answersData = opcionIds.map((id_opcion) => ({ id_intento: id_intento, id_opcion }));

		await this.prisma.respuesta.createMany({ data: answersData, skipDuplicates: true });

		return { inserted: answersData.length };
	}

	// Método para finalizar un intento de simulacro
	async finishAttempt(id_intento: number) {
		const intento = await this.prisma.intentoSimulacro.findUnique({ where: { id_intento } });
		if (!intento) throw new NotFoundException(`Intento ${id_intento} no encontrado`);

		const fecha_fin = new Date();
		const tiempoMin = Math.round((fecha_fin.getTime() - intento.fecha_inicio.getTime()) / 60000);

		const correctCount = await this.prisma.respuesta.count({
			where: { id_intento, opcion: { es_correcta: true } },
		});

		await this.prisma.intentoSimulacro.update({
			where: { id_intento },
			data: { fecha_fin, tiempo_utilizado: tiempoMin, puntaje_total: correctCount },
		});

		return this.prisma.intentoSimulacro.findUnique({
			where: { id_intento },
			include: { respuestas: { include: { opcion: true } }, usuario: true, simulacro: true },
		});
	}

	// Método para obtener un intento por su ID
	async getAttempt(id_intento: number) {
		return this.prisma.intentoSimulacro.findUnique({
			where: { id_intento },
			include: { respuestas: { include: { opcion: true } }, usuario: true, simulacro: true },
		});
	}

}
