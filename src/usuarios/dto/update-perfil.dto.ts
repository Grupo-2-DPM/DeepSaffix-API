import { IsNotEmpty, IsInt, Min, Max } from 'class-validator';

export class UpdatePerfilDto {
    @IsNotEmpty({ message: 'El programa académico es obligatorio' })
    programa_academico: string;

    @IsNotEmpty({ message: 'El semestre es obligatorio' })
    @IsInt({ message: 'El semestre debe ser un número entero' })
    @Min(1, { message: 'El semestre mínimo es 1' })
    @Max(10, { message: 'El semestre máximo es 10' })
    semestre: number;
}