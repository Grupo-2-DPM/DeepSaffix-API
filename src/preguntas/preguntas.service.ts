import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePreguntaDto } from './dto/create-pregunta.dto';
import { UpdatePreguntaDto } from './dto/update-pregunta.dto';

@Injectable()
export class PreguntasService {
  constructor(private prisma: PrismaService) {}

  // Crear pregunta
  async create(createDto: CreatePreguntaDto) {
    return this.prisma.pregunta.create({
      data: createDto,
    });
  }

  // Listar todas con sus opciones-> preguntas
  async findAll() {
    return this.prisma.pregunta.findMany({
      include: {
        opciones: true,
      },
      orderBy: { id_pregunta: 'desc' },
    });
  }

  // Obtener una pregunta por ID
  async findOne(id: number) {
    const pregunta = await this.prisma.pregunta.findUnique({
      where: { id_pregunta: id },
      include: {
        opciones: true,
      },
    });

    if (!pregunta) {
      throw new NotFoundException(`Pregunta con ID ${id} no encontrada`);
    }

    return pregunta;
  }

  // Actualizar pregunta
  async update(id: number, updateDto: UpdatePreguntaDto) {
    await this.findOne(id); // Valida que exista

    return this.prisma.pregunta.update({
      where: { id_pregunta: id },
      data: updateDto,
    });
  }

  // Eliminar pregunta (elimina opciones en cascada)
  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.pregunta.delete({
      where: { id_pregunta: id },
    });
  }

  // Filtrar por tipo y nivel (útil para crear simulacros)
  async findByFilters(tipo?: string, nivel?: string) {
    return this.prisma.pregunta.findMany({
      where: {
        ...(tipo && { tipo_pregunta: tipo as any }),
        ...(nivel && { nivel_dificultad: nivel as any }),
      },
      include: {
        opciones: true,
      },
    });
  }
}
