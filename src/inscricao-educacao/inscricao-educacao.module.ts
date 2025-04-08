import { Module } from '@nestjs/common';
import { InscricaoEducacaoService } from './inscricao-educacao.service';
import { InscricaoEducacaoController } from './inscricao-educacao.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InscricaoEducacao } from 'src/db/entities/inscricoes-educacao.entity';
import { Candidato } from 'src/db/entities/candidato.entity';
@Module({
  imports: [TypeOrmModule.forFeature([InscricaoEducacao, Candidato])],
  controllers: [InscricaoEducacaoController],
  providers: [InscricaoEducacaoService],
  exports: [InscricaoEducacaoService]
})
export class InscricaoEducacaoModule { }
