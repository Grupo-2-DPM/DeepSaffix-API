import { Module } from '@nestjs/common';
import { PreguntasController } from './preguntas.controller';
import { PreguntasService } from './preguntas.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [PreguntasController],
  providers: [PreguntasService, PrismaService],
  exports: [PreguntasService],
})
export class PreguntasModule {}
