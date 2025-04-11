import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCandidateDto } from './dto/create-candidate.dto';
import { UpdateCandidateDto } from './dto/update-candidate.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Candidato } from 'src/db/entities/candidato.entity';
import type { Repository } from 'typeorm';
import type { CurrentUser } from 'src/decorators/currentUser.decorator';
import * as bcrypt from 'bcryptjs';
import type { RecoveryPasswordDto } from './dto/recovery-password.dto';
import type { UpdateScoreDto } from '../inscricao-educacao/dto/update-score.dto';

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
  async findAll() {
    return this.candidatoRepo.find()
  }

  async findOne(id: number) {
    const candidate = await this.candidatoRepo.findOne({
      where: {
        id
      }
    })

    return candidate
  }

  async findByMe(user: CurrentUser) {
    const candidate = await this.candidatoRepo
      .createQueryBuilder('candidato')
      .leftJoinAndSelect('candidato.inscricoesEducacao', 'inscricao')
      .where('candidato.id = :id', { id: user.sub })
      .select([
        'candidato.id',
        'candidato.nome',
        'inscricao.id',
        'inscricao.escolaridade', // ou os campos que você quiser
        'inscricao.pontuacao',
        'inscricao.cargoFuncao'
      ])
      .getOne();

    return candidate;
  }

  async findByCpfNivel(cpf: string) {
    const candidate = await this.candidatoRepo.findOne({
      where: {
        cpf
      }
    })

    if (!candidate) {
      throw new NotFoundException('Candidato nao encontrado');
    }
    return candidate;
  }


  async recoveryPassword(id: number, newPassword: RecoveryPasswordDto) {
    const candidate = await this.findOne(id);
    if (!candidate) {
      throw new NotFoundException('Candidato não encontrado');
    }

    const passwordHash = await bcrypt.hash(newPassword.newPassword, 8);

    candidate.senha_hash = passwordHash;

    await this.candidatoRepo.save(candidate);

    await this.candidatoRepo.save(candidate);
  }

  update(id: number, updateCandidateDto: UpdateCandidateDto) {
    return `This action updates a #${id} candidate`;
  }

  remove(id: number) {
    return `This action removes a #${id} candidate`;
  }
}
