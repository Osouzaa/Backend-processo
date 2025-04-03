import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { InscricaoEducacao } from 'src/db/entities/inscricoes-educacao.entity';
import type { CreateInscricaoEducacaoDto } from './dto/create-inscricao-educacao.dto';
import type { UpdateInscricaoEducacaoDto } from './dto/update-inscricao-educacao.dto';

@Injectable()
export class InscricaoEducacaoService {
  constructor(
    @InjectRepository(InscricaoEducacao)
    private readonly inscricaoEducacaoRepository: Repository<InscricaoEducacao>,
  ) { }


  async create(
    dto: CreateInscricaoEducacaoDto,
    files: { cpfFile?: Express.Multer.File[]; comprovanteEndereco?: Express.Multer.File[] }
  ) {
    const candidate = await this.findByCpf(dto.cpf);
    if (candidate) {
      throw new ConflictException('Candidato já cadastrado!');
    }

    const candidateDir = path.join(__dirname, '../../uploads', dto.nomeCompleto.replace(/\s+/g, '_'));
    if (!fs.existsSync(candidateDir)) {
      fs.mkdirSync(candidateDir, { recursive: true });
    }

    function sanitizeFileName(filename: string): string {
      return filename.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "_");
    }

    const savedFiles: { [key: string]: string } = {};

    if (files.cpfFile?.length) {
      const cpfFilePath = path.join(candidateDir, 'cpf.pdf'); // Nome fixo: cpf.pdf
      fs.writeFileSync(cpfFilePath, files.cpfFile[0].buffer);
      savedFiles['cpfFile'] = cpfFilePath;
    }

    if (files.comprovanteEndereco?.length) {
      const addressFilePath = path.join(candidateDir, 'comprovante_endereco.pdf'); // Nome fixo: comprovante_endereco.pdf
      fs.writeFileSync(addressFilePath, files.comprovanteEndereco[0].buffer);
      savedFiles['comprovanteEndereco'] = addressFilePath;
    }

    // Criar inscrição com os caminhos dos arquivos salvos
    const novaInscricao = this.inscricaoEducacaoRepository.create({
      ...dto,
      cpfLink: savedFiles['cpfFile'],
      comprovanteEnderecoLink: savedFiles['comprovanteEndereco'],
    });

    // Salvar no banco de dados
    await this.inscricaoEducacaoRepository.save(novaInscricao);

    return novaInscricao;
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
