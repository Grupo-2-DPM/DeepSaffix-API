import { Test, TestingModule } from '@nestjs/testing';
import { PreguntasService } from './preguntas.service';
import { PrismaService } from '../prisma/prisma.service';

const mockPrisma = {} as Partial<PrismaService>;

describe('PreguntasService', () => {
  let service: PreguntasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PreguntasService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<PreguntasService>(PreguntasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
