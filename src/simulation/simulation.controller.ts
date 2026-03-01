// simulation.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { SimulationService } from './simulation.service';
import { CreateSimulacroDto } from './dto/create-simulacro.dto';
import { UpdateSimulacroDto } from './dto/update-simulacro.dto';
import { CreateAttemptDto } from './dto/create-attempt.dto';
import { SubmitAnswersDto } from './dto/submit-answers.dto';

@Controller('simulacros')
export class SimulationController {
  constructor(private readonly service: SimulationService) {}

  // ========================
  // ENDPOINTS PARA SIMULACROS
  // ========================

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  create(@Body() createDto: CreateSimulacroDto) {
    return this.service.create(createDto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ transform: true }))
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateSimulacroDto,
  ) {
    return this.service.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.service.remove(id);
  }

  // ========================
  // ENDPOINTS PARA INTENTOS
  // ========================

  @Post(':id/intentos')
  @UsePipes(new ValidationPipe({ transform: true }))
  startAttempt(
    @Param('id', ParseIntPipe) simulacroId: number,
    @Body() createDto: CreateAttemptDto,
  ) {
    return this.service.startAttempt(createDto, simulacroId);
  }

  @Get('intentos/:id')
  getAttempt(@Param('id', ParseIntPipe) id: number) {
    return this.service.getAttempt(id);
  }

  @Post('intentos/:id/respuestas')
  @UsePipes(new ValidationPipe({ transform: true }))
  submitAnswers(
    @Param('id', ParseIntPipe) intentoId: number,
    @Body() submitDto: SubmitAnswersDto,
  ) {
    return this.service.submitAnswers(intentoId, submitDto);
  }

  @Post('intentos/:id/finalizar')
  finishAttempt(@Param('id', ParseIntPipe) intentoId: number) {
    return this.service.finishAttempt(intentoId);
  }

  @Get('usuarios/:userId/intentos')
  getAttemptsByUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.service.findAttemptsByUser(userId);
  }
}
