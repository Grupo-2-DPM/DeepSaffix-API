// dto/create-intento.dto.ts

import { IsNumber } from 'class-validator';

export class CreateIntentoDto {
  @IsNumber()
  id_usuario: number;

  @IsNumber()
  id_simulacro: number;
}
