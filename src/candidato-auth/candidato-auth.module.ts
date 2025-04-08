
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Candidato } from 'src/db/entities/candidato.entity';
import { CandidatoAuthController } from './candidato-auth.controller';
import { CandidatoAuthService } from './candidato-auth.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Candidato]),
    JwtModule.register({
      secret: 'seuSegredoAqui', // idealmente usar env
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [CandidatoAuthController],
  providers: [CandidatoAuthService, JwtModule],
})
export class CandidatoAuthModule { }
