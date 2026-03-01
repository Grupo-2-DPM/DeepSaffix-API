import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOpcionDto } from './dto/create-opcion.dto';
import { UpdateOpcionDto } from './dto/update-opcion.dto';

@Injectable()
export class OpcionesService {
  constructor(private prisma: PrismaService) {}

  // Crear opción (valida que la pregunta exista)
  async create(createDto: CreateOpcionDto) {
    const pregunta = await this.prisma.pregunta.findUnique({
      where: { id_pregunta: createDto.id_pregunta },
    });

    if (!pregunta) {
      throw new BadRequestException(
        `La pregunta con ID ${createDto.id_pregunta} no existe`,
      );
    }

    return this.prisma.opcionPregunta.create({
      data: createDto,
      include: {
        pregunta: true,
      },
    });
  }

  // Listar todas las opciones
  async findAll() {
    return this.prisma.opcionPregunta.findMany({
      include: {
        pregunta: {
          select: {
            id_pregunta: true,
            enunciado: true,
          },
        },
      },
    });
  }

  // Obtener opciones de una pregunta específica
  async findByPregunta(idPregunta: number) {
    const pregunta = await this.prisma.pregunta.findUnique({
      where: { id_pregunta: idPregunta },
    });

    if (!pregunta) {
      throw new NotFoundException(
        `Pregunta con ID ${idPregunta} no encontrada`,
      );
    }

    return this.prisma.opcionPregunta.findMany({
      where: { id_pregunta: idPregunta },
      orderBy: { id_opcion: 'asc' },
    });
  }

  // Obtener una opción por ID
  async findOne(id: number) {
    const opcion = await this.prisma.opcionPregunta.findUnique({
      where: { id_opcion: id },
      include: {
        pregunta: true,
      },
    });

    if (!opcion) {
      throw new NotFoundException(`Opción con ID ${id} no encontrada`);
    }

    return opcion;
  }

  // Actualizar opción
  async update(id: number, updateDto: UpdateOpcionDto) {
    await this.findOne(id);

    return this.prisma.opcionPregunta.update({
      where: { id_opcion: id },
      data: updateDto,
    });
  }

  // Eliminar opción
  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.opcionPregunta.delete({
      where: { id_opcion: id },
    });
  }
}
