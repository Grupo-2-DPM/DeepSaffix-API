import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateQuestionDto } from './create-question.dto';
import { PoolCriteriaDto } from './pool-criteria.dto';

export class UpdateSimulacroDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  nombre?: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsNumber()
  duracion_minutos?: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateQuestionDto)
  preguntas?: CreateQuestionDto[];

  @IsOptional()
  @ValidateNested()
  @Type(() => PoolCriteriaDto)
  pool?: PoolCriteriaDto;
}
