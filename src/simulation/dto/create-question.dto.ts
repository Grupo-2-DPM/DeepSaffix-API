import { IsArray, IsEnum, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateOptionDto } from './create-option.dto';
import { TipoPregunta, NivelDificultad } from '@prisma/client';

export class CreateQuestionDto {
  @IsString()
  @IsNotEmpty()
  enunciado: string;

  @IsEnum(TipoPregunta)
  tipo_pregunta: TipoPregunta;

  @IsEnum(NivelDificultad)
  nivel_dificultad: NivelDificultad;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOptionDto)
  opciones: CreateOptionDto[];
}
