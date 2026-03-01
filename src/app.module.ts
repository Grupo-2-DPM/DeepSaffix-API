import { Module } from '@nestjs/common';
import { AppController } from './app.controller';

import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { SimulationModule } from './simulation/simulation.module';
import { PerfilAcademicoModule } from './perfil-academico/perfil-academico.module';
import { PreguntasModule } from './preguntas/preguntas.module';
import { OpcionesModule } from './opciones/opciones.module';
import { IntentosModule } from './intentos/intentos.module';
import { RespuestasModule } from './respuestas/respuestas.module';

@Module({
  imports: [
    PrismaModule,
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    AuthModule,
    UsuariosModule,
    PerfilAcademicoModule,
    SimulationModule,
    PreguntasModule,
    PreguntasModule,
    OpcionesModule,
    IntentosModule,
    RespuestasModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
