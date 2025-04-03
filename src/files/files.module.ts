import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilesService } from './files.service';
import { File } from 'src/db/entities/file.entity';
import { InscricaoEducacaoModule } from 'src/inscricao-educacao/inscricao-educacao.module';
import { FilesController } from './files.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([File]),
    InscricaoEducacaoModule, // IMPORTANDO O MÓDULO
  ],
  controllers: [FilesController],
  providers: [FilesService],
  exports: [FilesService],
})
export class FilesModule { }
