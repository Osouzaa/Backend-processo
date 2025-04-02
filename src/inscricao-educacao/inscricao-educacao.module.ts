import { Module } from '@nestjs/common';
import { InscricaoEducacaoService } from './inscricao-educacao.service';
import { InscricaoEducacaoController } from './inscricao-educacao.controller';

@Module({
  controllers: [InscricaoEducacaoController],
  providers: [InscricaoEducacaoService],
})
export class InscricaoEducacaoModule {}
