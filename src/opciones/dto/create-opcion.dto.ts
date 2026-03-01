import { IsBoolean, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateOpcionDto {
  @IsString()
  @IsNotEmpty({ message: 'El texto de la opción es obligatorio' })
  texto_opcion: string;

  @IsBoolean({ message: 'Debe indicar si la opción es correcta' })
  es_correcta: boolean;

  @IsInt({ message: 'El ID de la pregunta debe ser un número' })
  id_pregunta: number;
}
