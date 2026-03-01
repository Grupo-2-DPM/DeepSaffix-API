import { Module } from '@nestjs/common';
import { IntentosController } from './intentos.controller';
import { IntentosService } from './intentos.service';

@Module({
  controllers: [IntentosController],
  providers: [IntentosService]
})
export class IntentosModule {}
