// dto/submit-answers.dto.ts
import { IsArray, IsNumber, ValidateNested, Min } from 'class-validator';
import { Type } from 'class-transformer';

class AnswerDto {
  @IsNumber()
  id_simulacro_pregunta: number;

  @IsNumber()
  id_opcion: number;
}

export class SubmitAnswersDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AnswerDto)
  respuestas: AnswerDto[];
}
