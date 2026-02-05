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

@Controller('simulation')
export class SimulationController {
	constructor(private readonly service: SimulationService) {}

	@Post()
	@UsePipes(new ValidationPipe({ transform: true }))
	create(@Body() createDto: CreateSimulacroDto) {
		return this.service.create(createDto);
	}

	@Post(':id/attempts')
	@UsePipes(new ValidationPipe({ transform: true }))
	startAttempt(@Param('id', ParseIntPipe) id: number, @Body() body: CreateAttemptDto) {
		(body as any).id_simulacro = id;
		return this.service.startAttempt(body);
	}

	@Post('attempts/:id/answers')
	@UsePipes(new ValidationPipe({ transform: true }))
	submitAnswers(@Param('id', ParseIntPipe) id: number, @Body() body: SubmitAnswersDto) {
		return this.service.submitAnswers(id, body);
	}

	@Post('attempts/:id/finish')
	async finishAttempt(@Param('id', ParseIntPipe) id: number) {
		return this.service.finishAttempt(id);
	}

	@Get('attempts/:id')
	getAttempt(@Param('id', ParseIntPipe) id: number) {
		return this.service.getAttempt(id);
	}

	@Get('users/:userId/attempts')
	getAttemptsByUser(@Param('userId', ParseIntPipe) userId: number) {
		return this.service.findAttemptsByUser(userId);
	}

	@Get()
	findAll() {
		return this.service.findAll();
	}

	@Get(':id')
	findOne(@Param('id', ParseIntPipe) id: number) {
		return this.service.findOne(id);
	}

	@Delete(':id')
	@HttpCode(204)
	async remove(@Param('id', ParseIntPipe) id: number) {
		await this.service.remove(id);
	}

}
