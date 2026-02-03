import { Test, TestingModule } from '@nestjs/testing';
import { PerfilAcademicoController } from './perfil-academico.controller';

describe('PerfilAcademicoController', () => {
  let controller: PerfilAcademicoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PerfilAcademicoController],
      providers: [],
    }).compile();

    controller = module.get<PerfilAcademicoController>(PerfilAcademicoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
