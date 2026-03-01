import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePreguntaDto } from './dto/create-pregunta.dto';
import { UpdatePreguntaDto } from './dto/update-pregunta.dto';
import { findWithFilters } from '../utils/prisma-filter';

@Injectable()
export class PreguntasService {
  constructor(private prisma: PrismaService) {}

  // Crear pregunta
  async create(createDto: CreatePreguntaDto) {
    return this.prisma.pregunta.create({
      data: createDto,
    });
  }

  // Listar todas con sus opciones
  async findAll() {
    return this.prisma.pregunta.findMany({
      include: { opciones: true },
      orderBy: { id_pregunta: 'desc' },
    });
  }

  // Obtener una pregunta por ID
  async findOne(id: number) {
    const pregunta = await this.prisma.pregunta.findUnique({
      where: { id_pregunta: id },
      include: { opciones: true },
    });

    if (!pregunta) {
      throw new NotFoundException(`Pregunta con ID ${id} no encontrada`);
    }

    return pregunta;
  }

  // Actualizar pregunta
  async update(id: number, updateDto: UpdatePreguntaDto) {
    await this.findOne(id); // valida existencia
    return this.prisma.pregunta.update({
      where: { id_pregunta: id },
      data: updateDto,
    });
  }

  // Eliminar pregunta
  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.pregunta.delete({
      where: { id_pregunta: id },
    });
  }

  async findByFilters(params: {
    filters?: Record<string, any>;
    skip?: number;
    take?: number;
    orderBy?: { field: string; direction: 'asc' | 'desc' };
    search?: string;
  }) {
    const { filters, skip, take, orderBy, search } = params;

    const searchFields = search ? ['enunciado'] : [];

    return findWithFilters(this.prisma.pregunta, {
      filters: { ...filters, ...(search ? { enunciado: search } : {}) },
      skip,
      take,
      orderBy,
      include: { opciones: true },
      allowedFields: [
        'id_pregunta',
        'tipo_pregunta',
        'nivel_dificultad',
        'enunciado',
      ],
      searchFields,
    });
  }
}
