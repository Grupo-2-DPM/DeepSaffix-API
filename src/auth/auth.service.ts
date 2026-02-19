import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { ResultadoLogin } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async login(dto: LoginDto, ip?: string) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { correo: dto.correo },
    });

    if (!usuario) {
      await this.registrarLog(
        dto.correo,
        ResultadoLogin.FAIL,
        'Usuario no existe',
        ip,
      );
      throw new UnauthorizedException('Credenciales inválidas 001');
    }

    if (usuario.estado_cuenta !== 'ACTIVO') {
      await this.registrarLog(
        dto.correo,
        ResultadoLogin.FAIL,
        'Cuenta inactiva',
        ip,
        usuario.id_usuario,
      );
      throw new UnauthorizedException('Credenciales inválidas 002');
    }

    const passwordOk = await bcrypt.compare(dto.contraseña, usuario.contraseña);

    if (!passwordOk) {
      await this.registrarLog(
        dto.correo,
        ResultadoLogin.FAIL,
        'Contraseña incorrecta',
        ip,
        usuario.id_usuario,
      );
      throw new UnauthorizedException('Credenciales inválidas 003');
    }

    await this.registrarLog(
      dto.correo,
      ResultadoLogin.SUCCESS,
      undefined,
      ip,
      usuario.id_usuario,
    );

    const { ...userSafe } = usuario;
    return userSafe;
  }

  private async registrarLog(
    correo: string,
    resultado: ResultadoLogin,
    motivo?: string,
    ip?: string,
    idUsuario?: number,
  ) {
    await this.prisma.loginLog.create({
      data: {
        correo,
        resultado,
        motivo_error: motivo,
        ip,
        id_usuario: idUsuario,
      },
    });
  }
}
