import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CreateOptionDto {
  @IsString()
  @IsNotEmpty()
  texto_opcion: string;

  @IsBoolean()
  es_correcta: boolean;
}
