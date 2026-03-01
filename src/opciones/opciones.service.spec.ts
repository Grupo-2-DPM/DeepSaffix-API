import { Test, TestingModule } from '@nestjs/testing';
import { OpcionesService } from './opciones.service';

describe('OpcionesService', () => {
  let service: OpcionesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OpcionesService],
    }).compile();

    service = module.get<OpcionesService>(OpcionesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
