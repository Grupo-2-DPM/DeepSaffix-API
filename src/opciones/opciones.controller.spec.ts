import { Test, TestingModule } from '@nestjs/testing';
import { OpcionesController } from './opciones.controller';

describe('OpcionesController', () => {
  let controller: OpcionesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OpcionesController],
    }).compile();

    controller = module.get<OpcionesController>(OpcionesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
