import { Module } from '@nestjs/common';
import { PerfilAcademicoService } from './perfil-academico.service';
import { PerfilAcademicoController } from './perfil-academico.controller';

@Module({
  providers: [PerfilAcademicoService],
  controllers: [PerfilAcademicoController]
})
export class PerfilAcademicoModule {}
