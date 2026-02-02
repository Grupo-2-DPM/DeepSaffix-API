import { Test, TestingModule } from '@nestjs/testing';
import { PerfilAcademicoService } from './perfil-academico.service';

describe('PerfilAcademicoService', () => {
  let service: PerfilAcademicoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PerfilAcademicoService],
    }).compile();

    service = module.get<PerfilAcademicoService>(PerfilAcademicoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
