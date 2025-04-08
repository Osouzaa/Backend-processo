import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DataBaseModule } from './db/database.config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { InscricaoEducacaoModule } from './inscricao-educacao/inscricao-educacao.module';
import { FilesModule } from './files/files.module';
import { CandidatesModule } from './candidates/candidates.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'src/uploads'), // Caminho absoluto da pasta de uploads
      serveRoot: '/uploads', // URL base para acessar os arquivos
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    DataBaseModule,
    InscricaoEducacaoModule,
    FilesModule,
    CandidatesModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
