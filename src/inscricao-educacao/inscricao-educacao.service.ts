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
    files: {
      cpfFile?: Express.Multer.File[];
      comprovanteEndereco?: Express.Multer.File[];
      comprovanteReservista?: Express.Multer.File[];
    }
  ) {

    console.log(typeof dto.tempoExperiencia)
    const candidate = await this.findByCpf(dto.cpf);
    if (candidate) {
      throw new ConflictException('Candidato já cadastrado!');
    }

    const candidateDir = path.join(__dirname, '../../uploads', `${dto.nomeCompleto.replace(/\s+/g, '_')}_${dto.cpf}`);

    if (!fs.existsSync(candidateDir)) {
      fs.mkdirSync(candidateDir, { recursive: true });
    }

    const savedFiles: { [key: string]: string } = {};

    if (files.cpfFile?.length) {
      const cpfFilePath = path.join(candidateDir, 'cpf.pdf');
      fs.writeFileSync(cpfFilePath, files.cpfFile[0].buffer);
      savedFiles['cpfFile'] = cpfFilePath;
    }

    if (files.comprovanteEndereco?.length) {
      const addressFilePath = path.join(candidateDir, 'comprovante_endereco.pdf');
      fs.writeFileSync(addressFilePath, files.comprovanteEndereco[0].buffer);
      savedFiles['comprovanteEndereco'] = addressFilePath;
    }

    if (files.comprovanteReservista?.length) {
      const reservistaFilePath = path.join(candidateDir, 'comprovante_reservista.pdf');
      fs.writeFileSync(reservistaFilePath, files.comprovanteReservista[0].buffer);
      savedFiles['comprovanteReservista'] = reservistaFilePath;
    }

    const pontuacaoCalculada = this.calcularPontuacao(dto);

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



  private calcularPontuacao(dto: CreateInscricaoEducacaoDto): number {
    let pontuacao = 0;
    if (dto.cargoFuncao === "Auxiliar de Secretaria") {
      if (dto.possuiEnsinoMedio) {
        pontuacao += 10;
        console.log("Possui medio")
      }
      if (dto.possuiEnsinoSuperior) {
        pontuacao += 10;
        console.log("Possui superior")
      }
      if (Number(dto.tempoExperiencia) === 1) {
        pontuacao += 10;
      }
      if (Number(dto.tempoExperiencia) === 2) {
        pontuacao += 20;
        console.log("Possui 2 anos");
      }

      if (Number(dto.tempoExperiencia) === 3) {
        pontuacao += 30;
      }
      if (Number(dto.tempoExperiencia) === 4) {
        pontuacao += 40;
      }
      if (Number(dto.tempoExperiencia) === 5) {
        pontuacao += 50;
      }
    }

    return pontuacao;
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
