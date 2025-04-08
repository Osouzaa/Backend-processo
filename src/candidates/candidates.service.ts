import { ConflictException, Injectable } from '@nestjs/common';
import { CreateCandidateDto } from './dto/create-candidate.dto';
import { UpdateCandidateDto } from './dto/update-candidate.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Candidato } from 'src/db/entities/candidato.entity';
import type { Repository } from 'typeorm';

@Injectable()
export class CandidatesService {
  constructor(
    @InjectRepository(Candidato)
    private readonly candidatoRepo: Repository<Candidato>,
  ) { }
  async create(createCandidateDto: CreateCandidateDto) {
    try {
      const existCandidate = await this.findByCpf(createCandidateDto.cpf)

      if (existCandidate) {
        throw new ConflictException("Candidato ja cadastrado")
      }

      const newCandidate = this.candidatoRepo.create(createCandidateDto)
      await this.candidatoRepo.save(newCandidate)
      return newCandidate
    } catch (error) {
      console.error(error);
      throw new Error('Erro ao criar o usuário');
    }
  }

  async findByCpf(cpf: string) {
    const candidate = await this.candidatoRepo.findOne({
      where: {
        cpf
      }
    })

    return candidate || null
  }
  findAll() {
    return `This action returns all candidates`;
  }

  findOne(id: number) {
    return `This action returns a #${id} candidate`;
  }

  update(id: number, updateCandidateDto: UpdateCandidateDto) {
    return `This action updates a #${id} candidate`;
  }

  remove(id: number) {
    return `This action removes a #${id} candidate`;
  }
}
