import { PartialType } from '@nestjs/mapped-types'; 
import { IsNotEmpty, IsInt, Min, Max } from 'class-validator';
import { CreateUsuarioDto } from './create-usuario.dto';

export class UpdatePerfilDto extends PartialType (CreateUsuarioDto){
    @IsNotEmpty({ message: 'El nombre es obligatorio' })
    nombre: string;

    @IsNotEmpty({ message: 'El apellido es obligatorio' })
    apellido: string;

    @IsNotEmpty({ message: 'El programa académico es obligatorio' })
    programa_academico: string;

    @IsNotEmpty ({ message: 'El correo electrónico es obligatorio' })
    correo: string;

    @IsNotEmpty({ message: 'El semestre es obligatorio' })
    @IsInt({ message: 'El semestre debe ser un número entero' })
    @Min(1, { message: 'El semestre mínimo es 1' })
    @Max(10, { message: 'El semestre máximo es 10' })
    semestre: number;
}