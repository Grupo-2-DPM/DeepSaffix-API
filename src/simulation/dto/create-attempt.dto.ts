import { IsInt } from 'class-validator';

export class CreateAttemptDto {
  @IsInt()
  id_usuario: number;
}
