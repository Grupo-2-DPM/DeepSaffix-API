import { Test, TestingModule } from '@nestjs/testing';
import { SimulationService } from './simulation.service';
import { PrismaService } from '../prisma/prisma.service';

const mockPrisma = {
  simulacro: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
  },
};

describe('SimulationService', () => {
  let service: SimulationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SimulationService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<SimulationService>(SimulationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
