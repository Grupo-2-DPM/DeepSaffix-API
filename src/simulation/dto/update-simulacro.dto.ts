// dto/update-simulacro.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateSimulacroDto } from './create-simulacro.dto';

export class UpdateSimulacroDto extends PartialType(CreateSimulacroDto) {}
