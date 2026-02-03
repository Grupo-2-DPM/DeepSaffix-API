import {
	Body,
	Controller,
	Get,
	Param,
	ParseIntPipe,
	Post,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { SimulationService } from './simulation.service';
import { CreateSimulacroDto } from './dto/create-simulacro.dto';

@Controller('simulation')
export class SimulationController {
	constructor(private readonly service: SimulationService) {}

	@Post()
	@UsePipes(new ValidationPipe({ transform: true }))
	create(@Body() createDto: CreateSimulacroDto) {
		return this.service.create(createDto);
	}

	@Get()
	findAll() {
		return this.service.findAll();
	}

	@Get(':id')
	findOne(@Param('id', ParseIntPipe) id: number) {
		return this.service.findOne(id);
	}
}
