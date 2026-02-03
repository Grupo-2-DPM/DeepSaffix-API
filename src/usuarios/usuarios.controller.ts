import { Controller, Get, Post, Body, Param, HttpCode, HttpStatus, Patch } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';

@Controller('usuarios')
export class UsuariosController {
    constructor(private readonly usuariosService: UsuariosService) { }

    // Crear un usuario
    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() createUsuarioDto: CreateUsuarioDto) {
        return this.usuariosService.create(createUsuarioDto);
    }

    // Listar todos los usuarios
    @Get()
    async findAll() {
        return this.usuariosService.findAll();
    }

    // Obtener un usuario por ID
    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.usuariosService.findOne(+id);
    }

    // Desactivar un usuario (soft delete)
    @Patch(':id/eliminar')
    @HttpCode(HttpStatus.NO_CONTENT)
    async remove(@Param('id') id: string) {
        await this.usuariosService.deactivateUsuario(+id);
    }
}
