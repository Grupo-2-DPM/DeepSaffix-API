import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOpcionDto } from './dto/create-opcion.dto';
import { UpdateOpcionDto } from './dto/update-opcion.dto';

@Injectable()
export class OpcionesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateOpcionDto) {
    return this.prisma.opcionPregunta.create({ data: dto });
  }

  async findAll() {
    return this.prisma.opcionPregunta.findMany({ include: { pregunta: true } });
  }

  async findOne(id: number) {
    const opcion = await this.prisma.opcionPregunta.findUnique({
      where: { id_opcion: id },
      include: { pregunta: true },
    });
    if (!opcion) throw new NotFoundException(`Opción ${id} no encontrada`);
    return opcion;
  }

  async update(id: number, dto: UpdateOpcionDto) {
    await this.findOne(id);
    return this.prisma.opcionPregunta.update({
      where: { id_opcion: id },
      data: dto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.opcionPregunta.delete({ where: { id_opcion: id } });
  }
}
