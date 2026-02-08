import { Controller, Post, Patch, Get, Delete, Param, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { PerfilAcademicoService } from './perfil-academico.service';
import { CreatePerfilDto } from './dto/create-perfil.dto';
import { UpdatePerfilDto } from './dto/update-perfil.dto';

@Controller('perfil-academico')
export class PerfilAcademicoController {
  constructor(private readonly service: PerfilAcademicoService) { }

  // Endpoint para crear el perfil académico de un usuario, se recibe el ID del usuario como parámetro en la URL y los datos del perfil en el cuerpo de la petición
  @Post(':id_usuario')
  @HttpCode(HttpStatus.CREATED)
  create(@Param('id_usuario') id_usuario: string, @Body() dto: CreatePerfilDto) {
    return this.service.create(+id_usuario, dto);
  }

  // Endpoint para actualizar el perfil académico de un usuario, se recibe el ID del usuario como parámetro en la URL y los datos a actualizar en el cuerpo de la petición
  @Patch(':id_usuario')
  update(@Param('id_usuario') id_usuario: string, @Body() dto: UpdatePerfilDto) {
    return this.service.update(+id_usuario, dto);
  }

  // Endpoint para obtener el perfil académico de un usuario por su ID, se recibe el ID del usuario como parámetro en la URL
  @Get(':id_usuario')
  findOne(@Param('id_usuario') id_usuario: string) {
    return this.service.findByUser(+id_usuario);
  }

  // Endpoint para eliminar el perfil académico de un usuario, se recibe el ID del usuario como parámetro en la URL
  @Delete(':id_usuario')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id_usuario') id_usuario: string) {
    await this.service.delete(+id_usuario);
  }
}