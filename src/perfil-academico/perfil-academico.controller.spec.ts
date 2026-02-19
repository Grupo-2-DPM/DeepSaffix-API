import { Test, TestingModule } from '@nestjs/testing';
import { PerfilAcademicoController } from './perfil-academico.controller';
import { PerfilAcademicoService } from './perfil-academico.service';

const mockPerfilService = {} as Partial<PerfilAcademicoService>;

describe('PerfilAcademicoController', () => {
  let controller: PerfilAcademicoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PerfilAcademicoController],
      providers: [
        { provide: PerfilAcademicoService, useValue: mockPerfilService },
      ],
    }).compile();

    controller = module.get<PerfilAcademicoController>(
      PerfilAcademicoController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
