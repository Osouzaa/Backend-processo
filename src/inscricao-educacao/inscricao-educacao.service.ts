import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { InscricaoEducacao } from 'src/db/entities/inscricoes-educacao.entity';
import type { CreateInscricaoEducacaoDto } from './dto/create-inscricao-educacao.dto';
import type { UpdateInscricaoEducacaoDto } from './dto/update-inscricao-educacao.dto';
import { calcularPontuacao } from 'src/utils/calc-pontuacao';
import { env } from 'src/env';

@Injectable()
export class InscricaoEducacaoService {
  private readonly BASE_URL = env.BASE_URL
  constructor(
    @InjectRepository(InscricaoEducacao)
    private readonly inscricaoEducacaoRepository: Repository<InscricaoEducacao>,
  ) { }

  async create(
    dto: CreateInscricaoEducacaoDto,
    files: {
      cpfFile?: Express.Multer.File[];
      comprovanteEndereco?: Express.Multer.File[];
      comprovanteReservista?: Express.Multer.File[];
    }
  ) {
    const candidate = await this.findByCpf(dto.cpf);
    if (candidate) {
      throw new ConflictException('Candidato já cadastrado!');
    }

    // Função de sanitização
    function sanitize(str: string): string {
      return str.normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, "_")
        .replace(/[^\w\s]/gi, "");
    }

    const nomeSanitizado = sanitize(dto.nomeCompleto);
    const cpfSanitizado = dto.cpf.replace(/\D/g, "");
    const userFolder = `${nomeSanitizado}_${cpfSanitizado}`;
    const userDir = path.join(__dirname, '../../uploads', userFolder);

    if (!fs.existsSync(userDir)) {
      fs.mkdirSync(userDir, { recursive: true });
    }

    const savedFiles: { [key: string]: string } = {};

    if (files.cpfFile?.length) {
      const fileName = 'cpf.pdf';
      const filePath = path.join(userDir, fileName);
      fs.writeFileSync(filePath, files.cpfFile[0].buffer);

      savedFiles['cpfFile'] = `${this.BASE_URL}/${userFolder}/${fileName}`;
    }

    if (files.comprovanteEndereco?.length) {
      const fileName = 'comprovante_endereco.pdf';
      const filePath = path.join(userDir, fileName);
      fs.writeFileSync(filePath, files.comprovanteEndereco[0].buffer);

      savedFiles['comprovanteEndereco'] = `${this.BASE_URL}/${userFolder}/${fileName}`;
    }

    if (files.comprovanteReservista?.length) {
      const fileName = 'comprovante_reservista.pdf';
      const filePath = path.join(userDir, fileName);
      fs.writeFileSync(filePath, files.comprovanteReservista[0].buffer);

      savedFiles['comprovanteReservista'] = `${this.BASE_URL}/${userFolder}/${fileName}`;
    }

    const pontuacaoCalculada = calcularPontuacao(dto);

    const novaInscricao = this.inscricaoEducacaoRepository.create({
      ...dto,
      pontuacao: pontuacaoCalculada,
      cpfLink: savedFiles['cpfFile'],
      comprovanteEnderecoLink: savedFiles['comprovanteEndereco'],
      certificadoReservistaLink: savedFiles['comprovanteReservista'],
    });

    await this.inscricaoEducacaoRepository.save(novaInscricao);

    return {
      id: novaInscricao.id,
      pontuacao: novaInscricao.pontuacao,
    };
  }

  async findByCpf(cpf: string) {
    return this.inscricaoEducacaoRepository.findOne({ where: { cpf } });
  }

  async findAll() {
    return this.inscricaoEducacaoRepository.find();
  }

  async findOne(id: number) {
    const inscricao = await this.inscricaoEducacaoRepository.findOne({ where: { id }, relations: ['files'] });

    if (!inscricao) {
      throw new Error('Inscrição não encontrada');
    }

    return inscricao;
  }

  update(id: number, updateInscricaoEducacaoDto: UpdateInscricaoEducacaoDto) {
    return `Esta ação atualiza a inscrição #${id}`;
  }

  remove(id: number) {
    return `Esta ação remove a inscrição #${id}`;
  }
}
