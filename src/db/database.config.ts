import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { env } from 'src/env';
import { InscricaoEducacao } from './entities/inscricoes-educacao.entity';
import { File } from './entities/file.entity';
import { Candidato } from './entities/candidato.entity';
import { User } from './entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: env.DB_HOST,
      port: env.DB_PORT,
      username: env.DB_USERNAME,
      password: env.DB_PASSWORD,
      database: env.DB_NAME,
      entities: [InscricaoEducacao, File, Candidato, User],
      // ssl: true,
      synchronize: true,
    }),
  ],
})
export class DataBaseModule { }
