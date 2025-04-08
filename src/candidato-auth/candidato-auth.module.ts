
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Candidato } from 'src/db/entities/candidato.entity';
import { CandidatoAuthController } from './candidato-auth.controller';
import { CandidatoAuthService } from './candidato-auth.service';
import { jwtConstants } from 'src/auth/constants';

@Module({
  imports: [
    TypeOrmModule.forFeature([Candidato]),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '15d' },
    }),
  ],
  controllers: [CandidatoAuthController],
  providers: [CandidatoAuthService, JwtModule],
})
export class CandidatoAuthModule { }
