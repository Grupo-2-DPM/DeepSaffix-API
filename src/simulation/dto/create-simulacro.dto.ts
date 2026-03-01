// dto/create-simulacro.dto.ts
import {
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
  ValidateNested,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

class PoolFilterDto {
  @IsNumber()
  @Min(1)
  cantidad: number;

  @IsOptional()
  @IsString()
  nivel_dificultad?: string;

  @IsOptional()
  @IsString()
  tipo_pregunta?: string;
}

export class CreateSimulacroDto {
  @IsString()
  nombre: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsNumber()
  @Min(1)
  duracion_minutos: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => PoolFilterDto)
  pool?: PoolFilterDto;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  preguntaIds?: number[]; // Array de IDs de preguntas existentes
}
