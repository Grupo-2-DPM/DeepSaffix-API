import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import { OpcionesService } from './opciones.service';
import { CreateOpcionDto } from './dto/create-opcion.dto';
import { UpdateOpcionDto } from './dto/update-opcion.dto';

@Controller('opciones')
export class OpcionesController {
  constructor(private readonly opcionesService: OpcionesService) {}

  // POST /opciones - Crear opción
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createDto: CreateOpcionDto) {
    return this.opcionesService.create(createDto);
  }

  // GET /opciones - Listar todas
  @Get()
  findAll() {
    return this.opcionesService.findAll();
  }

  // GET /opciones/pregunta/:idPregunta - Opciones de una pregunta
  @Get('pregunta/:idPregunta')
  findByPregunta(@Param('idPregunta', ParseIntPipe) idPregunta: number) {
    return this.opcionesService.findByPregunta(idPregunta);
  }

  // GET /opciones/:id - Obtener por ID
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.opcionesService.findOne(id);
  }

  // PATCH /opciones/:id - Actualizar
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateOpcionDto,
  ) {
    return this.opcionesService.update(id, updateDto);
  }

  // DELETE /opciones/:id - Eliminar
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.opcionesService.remove(id);
  }
}
