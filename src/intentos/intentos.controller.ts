import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { IntentosService } from './intentos.service';
import { CreateIntentoDto } from './dto/create-intento.dto';
import { SubmitAnswersDto } from './dto/submit-answer-dto';

@Controller('intentos')
export class IntentosController {
  constructor(private readonly service: IntentosService) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  startAttempt(@Body() createDto: CreateIntentoDto) {
    return this.service.startAttempt(createDto);
  }
  @Post(':id/finalizar')
  finishAttempt(@Param('id', ParseIntPipe) intentoId: number) {
    return this.service.finishAttempt(intentoId);
  }
  @Get(':id')
  getAttempt(@Param('id', ParseIntPipe) id: number) {
    return this.service.getAttempt(id);
  }
  @Post(':id/respuestas')
  @UsePipes(new ValidationPipe({ transform: true }))
  submitAnswers(
    @Param('id', ParseIntPipe)
    intentoId: number,
    @Body()
    submitDto: SubmitAnswersDto,
  ) {
    return this.service.submitAnswers(intentoId, submitDto);
  }
  @Get('usuario/:userId')
  getAttemptsByUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.service.findAttemptsByUser(userId);
  }
}
