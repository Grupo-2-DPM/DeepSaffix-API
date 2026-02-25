import { IsString, IsInt, Min, IsOptional, Max } from 'class-validator';

export class UpdatePerfilDto {
  @IsOptional()
  @IsString()
  programa_academico?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(10)
  semestre?: number;
}
