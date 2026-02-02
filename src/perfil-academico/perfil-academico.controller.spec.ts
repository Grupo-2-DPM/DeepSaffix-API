import { Controller, Post, Patch, Get, Param, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { PerfilAcademicoService } from './perfil-academico.service';
import { CreatePerfilDto } from './dto/create-perfil.dto';
import { UpdatePerfilDto } from './dto/update-perfil.dto';

@Controller('perfil-academico')
export class PerfilAcademicoController {
  constructor(private readonly service: PerfilAcademicoService) { }

  @Post(':id_usuario')
  @HttpCode(HttpStatus.CREATED)
  create(@Param('id_usuario') id_usuario: string, @Body() dto: CreatePerfilDto) {
    return this.service.create(+id_usuario, dto);
  }

  @Patch(':id_usuario')
  update(@Param('id_usuario') id_usuario: string, @Body() dto: UpdatePerfilDto) {
    return this.service.update(+id_usuario, dto);
  }

  @Get(':id_usuario')
  findOne(@Param('id_usuario') id_usuario: string) {
    return this.service.findByUser(+id_usuario);
  }
  @Delete(':id_usuario')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id_usuario') id_usuario: string) {
    await this.service.delete(+id_usuario);
  }
}
