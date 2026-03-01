import { Module } from '@nestjs/common';
import { OpcionesController } from './opciones.controller';
import { OpcionesService } from './opciones.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [OpcionesController],
  providers: [OpcionesService, PrismaService],
  exports: [OpcionesService],
})
export class OpcionesModule {}
