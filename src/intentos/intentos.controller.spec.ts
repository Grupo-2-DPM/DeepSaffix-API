import { Test, TestingModule } from '@nestjs/testing';
import { IntentosController } from './intentos.controller';

describe('IntentosController', () => {
  let controller: IntentosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IntentosController],
    }).compile();

    controller = module.get<IntentosController>(IntentosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
