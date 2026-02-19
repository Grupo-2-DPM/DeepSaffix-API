import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePerfilDto } from './dto/create-perfil.dto';
import { UpdatePerfilDto } from './dto/update-perfil.dto';

@Injectable()
export class PerfilAcademicoService {
  constructor(private prisma: PrismaService) {}

  // Crea el perfil académico de un usuario, verificando que el usuario exista antes de crear el perfil
  async create(id_usuario: number, dto: CreatePerfilDto) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id_usuario },
    });
    if (!usuario)
      throw new NotFoundException(`Usuario con ID ${id_usuario} no encontrado`);

    return this.prisma.perfilAcademico.create({ data: { ...dto, id_usuario } });
  }

  // Actualiza el perfil académico de un usuario, verificando que el perfil exista antes de actualizarlo
  async update(id_usuario: number, dto: UpdatePerfilDto) {
    const perfil = await this.prisma.perfilAcademico.findUnique({
      where: { id_usuario },
    });
    if (!perfil)
      throw new NotFoundException(
        `Perfil académico del usuario ${id_usuario} no encontrado`,
      );

    return this.prisma.perfilAcademico.update({
      where: { id_usuario },
      data: { ...dto, fecha_actualizacion: new Date() },
    });
  }

  // Obtiene el perfil académico de un usuario por su ID, verificando que el perfil exista antes de devolverlo
  async findByUser(id_usuario: number) {
    const perfil = await this.prisma.perfilAcademico.findUnique({
      where: { id_usuario },
    });
    if (!perfil)
      throw new NotFoundException(
        `Perfil académico del usuario ${id_usuario} no encontrado`,
      );
    return perfil;
  }

  // Elimina el perfil académico de un usuario, verificando que el perfil exista antes de eliminarlo
  async delete(id_usuario: number) {
    const perfil = await this.prisma.perfilAcademico.findUnique({
      where: { id_usuario },
    });
    if (!perfil)
      throw new NotFoundException(
        `Perfil académico del usuario ${id_usuario} no encontrado`,
      );

    return this.prisma.perfilAcademico.delete({ where: { id_usuario } });
  }
}
