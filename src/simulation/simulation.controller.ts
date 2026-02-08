import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	ParseIntPipe,
	Post,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { SimulationService } from './simulation.service';
import { CreateSimulacroDto } from './dto/create-simulacro.dto';
import { CreateAttemptDto } from './dto/create-attempt.dto';
import { SubmitAnswersDto } from './dto/submit-answers.dto';

@Controller('simulacros')
export class SimulationController {
	constructor(private readonly service: SimulationService) {}

	// Endpoint para crear un nuevo simulacro
	@Post()
	@UsePipes(new ValidationPipe({ transform: true }))
	create(@Body() createDto: CreateSimulacroDto) {
		return this.service.create(createDto);
	}

	// Endpoint para iniciar un nuevo intento de simulacro
	@Post(':id/intentos')
	@UsePipes(new ValidationPipe({ transform: true }))
	startAttempt(@Param('id', ParseIntPipe) id: number, @Body() body: CreateAttemptDto) {
		(body as any).id_simulacro = id;
		return this.service.startAttempt(body);
	}

	// Endpoint para enviar respuestas de un intento
	@Post('intentos/:id/respuestas')
	@UsePipes(new ValidationPipe({ transform: true }))
	submitAnswers(@Param('id', ParseIntPipe) id: number, @Body() body: SubmitAnswersDto) {
		return this.service.submitAnswers(id, body);
	}

	// Endpoint para finalizar un intento de simulacro
	@Post('intentos/:id/finalizar')
	async finishAttempt(@Param('id', ParseIntPipe) id: number) {
		return this.service.finishAttempt(id);
	}

	// Endpoint para obtener un intento por su ID
	@Get('intentos/:id')
	getAttempt(@Param('id', ParseIntPipe) id: number) {
		return this.service.getAttempt(id);
	}

	// Endpoint para obtener los intentos realizados por un usuario
	@Get('usuarios/:userId/intentos')
	getAttemptsByUser(@Param('userId', ParseIntPipe) userId: number) {
		return this.service.findAttemptsByUser(userId);
	}

	// Endpoint para listar todos los simulacros
	@Get()
	findAll() {
		return this.service.findAll();
	}

	// Endpoint para obtener un simulacro por su ID
	@Get(':id')
	findOne(@Param('id', ParseIntPipe) id: number) {
		return this.service.findOne(id);
	}

	// Endpoint para eliminar un simulacro por su ID
	@Delete(':id')
	@HttpCode(204)
	async remove(@Param('id', ParseIntPipe) id: number) {
		await this.service.remove(id);
	}

}
