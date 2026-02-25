import { IsEnum, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { NivelDificultad, TipoPregunta } from '@prisma/client';

export class PoolCriteriaDto {
  @IsNumber()
  @IsNotEmpty()
  cantidad: number;

  @IsOptional()
  @IsEnum(NivelDificultad)
  nivel_dificultad?: NivelDificultad;

  @IsOptional()
  @IsEnum(TipoPregunta)
  tipo_pregunta?: TipoPregunta;
}
