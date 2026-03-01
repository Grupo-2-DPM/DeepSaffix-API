// dto/create-attempt.dto.ts
import { IsNumber } from 'class-validator';

export class CreateAttemptDto {
  @IsNumber()
  id_usuario: number;
}
