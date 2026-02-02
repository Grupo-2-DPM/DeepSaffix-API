import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { SimulationModule } from './simulation/simulation.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { PerfilAcademicoModule } from './perfil-academico/perfil-academico.module';

@Module({
  imports: [PrismaModule, ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env', }), SimulationModule, UsuariosModule, PerfilAcademicoModule,],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
