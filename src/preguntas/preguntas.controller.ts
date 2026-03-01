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
  // GET /preguntas - Listar todas (con filtros opcionales, búsqueda y paginación)
  @Get()
  async findAll(
    @Query('tipo') tipo?: string,
    @Query('nivel') nivel?: string,
    @Query('search') search?: string,
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('orderField') orderField?: string,
    @Query('orderDir') orderDir?: 'asc' | 'desc',
  ) {
    // Construir filtros dinámicos
    const filters: Record<string, any> = {};
    if (tipo) filters.tipo_pregunta = tipo;
    if (nivel) filters.nivel_dificultad = nivel;

    // Llamar al servicio genérico
    return this.preguntasService.findByFilters({
      filters,
      search,
      skip: skip ? parseInt(skip) : undefined,
      take: take ? parseInt(take) : undefined,
      orderBy: orderField
        ? { field: orderField, direction: orderDir || 'asc' }
        : undefined,
    });
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
