import { Test, TestingModule } from '@nestjs/testing';
import { InscricaoEducacaoService } from './inscricao-educacao.service';

describe('InscricaoEducacaoService', () => {
  let service: InscricaoEducacaoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InscricaoEducacaoService],
    }).compile();

    service = module.get<InscricaoEducacaoService>(InscricaoEducacaoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
