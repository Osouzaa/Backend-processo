import { Test, TestingModule } from '@nestjs/testing';
import { InscricaoEducacaoController } from './inscricao-educacao.controller';
import { InscricaoEducacaoService } from './inscricao-educacao.service';

describe('InscricaoEducacaoController', () => {
  let controller: InscricaoEducacaoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InscricaoEducacaoController],
      providers: [InscricaoEducacaoService],
    }).compile();

    controller = module.get<InscricaoEducacaoController>(InscricaoEducacaoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
