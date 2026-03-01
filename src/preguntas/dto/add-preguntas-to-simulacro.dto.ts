import { IsArray, IsInt, IsOptional, ArrayMinSize } from 'class-validator';

export class AddPreguntasToSimulacroDto {
  @IsArray()
  @IsInt({ each: true })
  @ArrayMinSize(1)
  pregunta_ids: number[];

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  ordenes?: number[];
}
