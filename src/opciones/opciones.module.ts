import { Module } from '@nestjs/common';
import { OpcionesController } from './opciones.controller';
import { OpcionesService } from './opciones.service';

@Module({
  controllers: [OpcionesController],
  providers: [OpcionesService]
})
export class OpcionesModule {}
