import { Test, TestingModule } from '@nestjs/testing';
import { IntentosService } from './intentos.service';

describe('IntentosService', () => {
  let service: IntentosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IntentosService],
    }).compile();

    service = module.get<IntentosService>(IntentosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
