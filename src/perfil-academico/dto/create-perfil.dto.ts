import { IsString, IsInt, Min } from 'class-validator';

export class CreatePerfilDto {
  @IsString()
  programa_academico: string;

  @IsInt()
  @Min(1)
  semestre: number;
}
