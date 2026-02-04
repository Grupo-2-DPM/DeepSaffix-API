import { IsArray, ArrayNotEmpty, IsInt } from 'class-validator';

export class SubmitAnswersDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  selected_option_ids: number[];
}
