import { PartialType } from '@nestjs/mapped-types';
import { CreateOpcionDto } from './create-opcion.dto';
import { IsOptional } from 'class-validator';

export class UpdateOpcionDto extends PartialType(CreateOpcionDto) {
  @IsOptional()
  id_pregunta?: number;
}
