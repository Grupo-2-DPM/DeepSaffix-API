import { Injectable, NotFoundException } from '@nestjs/common';
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

	async remove(id: number) {
		const existing = await this.prisma.simulacro.findUnique({ where: { id_simulacro: id } });
		if (!existing) throw new NotFoundException(`Simulacro con ID ${id} no encontrado`);

		await this.prisma.simulacro.delete({ where: { id_simulacro: id } });
		return;
	}
}
