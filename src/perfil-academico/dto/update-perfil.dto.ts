import { IsString, IsInt, Min, Max, IsOptional } from 'class-validator';

export class UpdatePerfilDto {
    @IsOptional()
    @IsString()
    programa_academico?: string;

    @IsOptional()
    @IsInt()
    @Min(1)
    semestre?: number;
}
