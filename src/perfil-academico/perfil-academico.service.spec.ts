import { Test, TestingModule } from '@nestjs/testing';
import { PerfilAcademicoService } from './perfil-academico.service';
import { PrismaService } from '../prisma/prisma.service';

const mockPrisma = {} as Partial<PrismaService>;

describe('PerfilAcademicoService', () => {
  let service: PerfilAcademicoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PerfilAcademicoService, { provide: PrismaService, useValue: mockPrisma }],
    }).compile();

    service = module.get<PerfilAcademicoService>(PerfilAcademicoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
