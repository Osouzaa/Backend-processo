import { Module } from '@nestjs/common';
import { InscricaoEducacaoService } from './inscricao-educacao.service';
import { InscricaoEducacaoController } from './inscricao-educacao.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InscricaoEducacao } from 'src/db/entities/inscricoes-educacao,entity';
@Module({
  imports: [TypeOrmModule.forFeature([InscricaoEducacao])],
  controllers: [InscricaoEducacaoController],
  providers: [InscricaoEducacaoService],
})
export class InscricaoEducacaoModule { }
