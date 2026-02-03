import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSimulacroDto } from './dto/create-simulacro.dto';

@Injectable()
export class SimulationService {
	constructor(private prisma: PrismaService) {}

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

	async findAll() {
		return this.prisma.simulacro.findMany({
			include: { preguntas: { include: { opciones: true } } },
		});
	}

	async findOne(id: number) {
		return this.prisma.simulacro.findUnique({
			where: { id_simulacro: id },
			include: { preguntas: { include: { opciones: true } } },
		});
	}
}
