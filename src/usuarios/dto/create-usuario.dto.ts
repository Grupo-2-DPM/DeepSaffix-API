import { IsEmail, IsNotEmpty, MinLength, Matches, IsOptional, IsInt, Min, Max } from 'class-validator';

export class CreateUsuarioDto {
    @IsNotEmpty({ message: 'El nombre es obligatorio' })
    nombre: string;

    @IsNotEmpty({ message: 'El apellido es obligatorio' })
    apellido: string;

    @IsEmail({}, { message: 'Debe ser un correo electrónico válido' })
    correo: string;

    @IsNotEmpty({ message: 'La contraseña es obligatoria' })
    @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
        message: 'La contraseña debe contener al menos una mayúscula, una minúscula y un número',
    })
    contraseña: string;

    @IsOptional()
    programa_academico?: string;

    @IsOptional()
    @IsInt({ message: 'El semestre debe ser un número entero' })
    @Min(1, { message: 'El semestre mínimo es 1' })
    @Max(10, { message: 'El semestre máximo es 10' })
    semestre?: number;
}