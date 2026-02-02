import { Controller, Get, Post, Body, Param, HttpCode, HttpStatus, Patch } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { IsNotEmpty, IsInt, Min, Max } from 'class-validator';
import { UpdatePerfilDto } from './dto/update-perfil.dto';

@Controller('usuarios')
export class UsuariosController {
    constructor(private readonly usuariosService: UsuariosService) { }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() createUsuarioDto: CreateUsuarioDto) {
        return this.usuariosService.create(createUsuarioDto);
    }

    @Get()
    async findAll() {
        return this.usuariosService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.usuariosService.findOne(+id);
    }
    @Patch(':id/eliminar')
    @HttpCode(HttpStatus.NO_CONTENT)
    async remove(@Param('id') id: string) {
        await this.usuariosService.deactivateUsuario(+id);
    }



}
