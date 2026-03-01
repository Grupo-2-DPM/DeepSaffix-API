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
  Query,
} from '@nestjs/common';
import { PreguntasService } from './preguntas.service';
import { CreatePreguntaDto } from './dto/create-pregunta.dto';
import { UpdatePreguntaDto } from './dto/update-pregunta.dto';

@Controller('preguntas')
export class PreguntasController {
  constructor(private readonly preguntasService: PreguntasService) {}

  // POST /preguntas - Crear pregunta
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createDto: CreatePreguntaDto) {
    return this.preguntasService.create(createDto);
  }

  // GET /preguntas - Listar todas (con filtros opcionales)
  @Get()
  findAll(@Query('tipo') tipo?: string, @Query('nivel') nivel?: string) {
    if (tipo || nivel) {
      return this.preguntasService.findByFilters(tipo, nivel);
    }
    return this.preguntasService.findAll();
  }

  // GET /preguntas/:id - Obtener por ID
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.preguntasService.findOne(id);
  }

  // PATCH /preguntas/:id - Actualizar
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdatePreguntaDto,
  ) {
    return this.preguntasService.update(id, updateDto);
  }

  // DELETE /preguntas/:id - Eliminar
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.preguntasService.remove(id);
  }
}
