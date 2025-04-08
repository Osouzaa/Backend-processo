import { Module } from '@nestjs/common';
import { CandidatesService } from './candidates.service';
import { CandidatesController } from './candidates.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Candidato } from 'src/db/entities/candidato.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Candidato])],
  controllers: [CandidatesController],
  providers: [CandidatesService],
})
export class CandidatesModule { }
