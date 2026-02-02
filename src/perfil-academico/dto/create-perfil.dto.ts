import { IsString, IsInt, Min, Max } from 'class-validator';

export class CreatePerfilDto {
    @IsString()
    programa_academico: string;

    @IsInt()
    @Min(1)
    semestre: number;
}
