import { Module } from '@nestjs/common';
import { InscricaoEducacaoService } from './inscricao-educacao.service';
import { InscricaoEducacaoController } from './inscricao-educacao.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InscricaoEducacao } from 'src/db/entities/inscricoes-educacao.entity';
import { FilesModule } from 'src/files/files.module';
@Module({
  imports: [TypeOrmModule.forFeature([InscricaoEducacao]), FilesModule],
  controllers: [InscricaoEducacaoController],
  providers: [InscricaoEducacaoService],
})
export class InscricaoEducacaoModule { }
