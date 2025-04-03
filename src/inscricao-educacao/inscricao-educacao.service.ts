import { ConflictException, Injectable } from '@nestjs/common';
import { CreateInscricaoEducacaoDto } from './dto/create-inscricao-educacao.dto';
import { UpdateInscricaoEducacaoDto } from './dto/update-inscricao-educacao.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InscricaoEducacao } from 'src/db/entities/inscricoes-educacao.entity';

@Injectable()
export class InscricaoEducacaoService {
  constructor(
    @InjectRepository(InscricaoEducacao)
    private inscricaoEducacaoRepository: Repository<InscricaoEducacao>,
  ) { }
  async create(dto: CreateInscricaoEducacaoDto, files: { cpf?: Express.Multer.File[], comprovanteEndereco?: Express.Multer.File[] }) {
    const candidate = await this.findByCpf(dto.cpf);
    if (candidate) {
      throw new ConflictException('Candidato já cadastrado!');
    }

    const novaInscricao = this.inscricaoEducacaoRepository.create(dto);

    await this.inscricaoEducacaoRepository.save(novaInscricao);
  }

  async findByCpf(cpf: string) {
    const candidate = await this.inscricaoEducacaoRepository.findOne({
      where: {
        cpf
      }
    })

    return candidate
  }

  async findAll() {
    const candidates = await this.inscricaoEducacaoRepository.find()
    return candidates
  }

  findOne(id: number) {
    return `This action returns a #${id} inscricaoEducacao`;
  }

  update(id: number, updateInscricaoEducacaoDto: UpdateInscricaoEducacaoDto) {
    return `This action updates a #${id} inscricaoEducacao`;
  }

  remove(id: number) {
    return `This action removes a #${id} inscricaoEducacao`;
  }
}
