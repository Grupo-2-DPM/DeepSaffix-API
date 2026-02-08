import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
@Injectable()
export class UsuariosService {
  constructor(private prisma: PrismaService) { }

  // Método para crear un nuevo usuario  
  async create(createUsuarioDto: CreateUsuarioDto) {
    const existingUser = await this.prisma.usuario.findUnique({
      where: { correo: createUsuarioDto.correo },
    });
    if (existingUser) throw new ConflictException('El correo electrónico ya está registrado');

    const hashedPassword = await bcrypt.hash(createUsuarioDto.contraseña, 10);

    const usuario = await this.prisma.usuario.create({
      data: {
        nombre: createUsuarioDto.nombre,
        apellido: createUsuarioDto.apellido,
        correo: createUsuarioDto.correo,
        contraseña: hashedPassword,
      },
    });

    const { contraseña, ...usuarioSinPassword } = usuario;
    return usuarioSinPassword;
  }

  // Método para listar todos los usuarios
  async findAll() {
    return this.prisma.usuario.findMany({
      select: {
        id_usuario: true,
        nombre: true,
        apellido: true,
        correo: true,
        fecha_registro: true,
        estado_cuenta: true,
        perfilAcademico: true
      },
      orderBy: { fecha_registro: 'desc' },
    });
  }

  // Método para obtener un usuario por su ID
  async findOne(id: number) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id_usuario: id },
      select: {
        id_usuario: true,
        nombre: true,
        apellido: true,
        correo: true,
        fecha_registro: true,
        estado_cuenta: true,
        perfilAcademico: true,
      },
    });
    if (!usuario) throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    return usuario;
  }

  // Método para desactivar un usuario
  async deactivateUsuario(id_usuario: number) {
    const usuario = await this.prisma.usuario.findUnique({ where: { id_usuario } });
    if (!usuario) throw new NotFoundException(`Usuario con ID ${id_usuario} no encontrado`);

    return this.prisma.usuario.update({
      where: { id_usuario },
      data: { estado_cuenta: 'INACTIVO' },
    });
  }

    // Método para eliminar un usuario
  async deleteUsuario(id_usuario: number) {
    const usuario = await this.prisma.usuario.findUnique({ where: { id_usuario } });
    if (!usuario) throw new NotFoundException(`Usuario con ID ${id_usuario} no encontrado`);

    return this.prisma.usuario.delete({ where: { id_usuario } });
  }

  // Método para actualizar el perfil de un usuario
  async updateUsuario(id_usuario: number, updateUsuarioDto: UpdateUsuarioDto) {
    const usuario = await this.prisma.usuario.findUnique({ where: { id_usuario } });
    if (!usuario) throw new NotFoundException(`Usuario con ID ${id_usuario} no encontrado`);

    return this.prisma.usuario.update({
      where: { id_usuario },
      data: updateUsuarioDto,
    });
  }
}

