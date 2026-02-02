import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePerfilDto } from './dto/create-perfil.dto';
import { UpdatePerfilDto } from './dto/update-perfil.dto';

@Injectable()
export class PerfilAcademicoService {
    constructor(private prisma: PrismaService) { }

    async create(id_usuario: number, dto: CreatePerfilDto) {
        const usuario = await this.prisma.usuario.findUnique({ where: { id_usuario } });
        if (!usuario) throw new NotFoundException(`Usuario con ID ${id_usuario} no encontrado`);

        return this.prisma.perfilAcademico.create({ data: { ...dto, id_usuario } });
    }

    async update(id_usuario: number, dto: UpdatePerfilDto) {
        const perfil = await this.prisma.perfilAcademico.findUnique({ where: { id_usuario } });
        if (!perfil) throw new NotFoundException(`Perfil académico del usuario ${id_usuario} no encontrado`);

        return this.prisma.perfilAcademico.update({
            where: { id_usuario },
            data: { ...dto, fecha_actualizacion: new Date() },
        });
    }

    async findByUser(id_usuario: number) {
        const perfil = await this.prisma.perfilAcademico.findUnique({ where: { id_usuario } });
        if (!perfil) throw new NotFoundException(`Perfil académico del usuario ${id_usuario} no encontrado`);
        return perfil;
    }
    async delete(id_usuario: number) {
        const perfil = await this.prisma.perfilAcademico.findUnique({ where: { id_usuario } });
        if (!perfil) throw new NotFoundException(`Perfil académico del usuario ${id_usuario} no encontrado`);

        return this.prisma.perfilAcademico.delete({ where: { id_usuario } });
    }

}
