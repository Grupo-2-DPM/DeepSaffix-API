import { IsEnum, IsInt, IsNotEmpty, IsString } from 'class-validator';
import { TipoPregunta, NivelDificultad } from '@prisma/client';

export class CreatePreguntaDto {
  @IsString()
  @IsNotEmpty({ message: 'El enunciado es obligatorio' })
  enunciado: string;

  @IsEnum(TipoPregunta, {
    message: 'Tipo de pregunta inválido (UNICA, MULTIPLE, ABIERTA)',
  })
  tipo_pregunta: TipoPregunta;

  @IsEnum(NivelDificultad, {
    message: 'Nivel de dificultad inválido (BAJO, MEDIO, ALTO)',
  })
  nivel_dificultad: NivelDificultad;
  @IsInt()
  id_simulacro: number; // <--- Campo obligatorio para Prisma
}
