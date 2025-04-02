import { ConflictException, Injectable } from '@nestjs/common';
import { CreateInscricaoEducacaoDto } from './dto/create-inscricao-educacao.dto';
import { UpdateInscricaoEducacaoDto } from './dto/update-inscricao-educacao.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InscricaoEducacao } from 'src/db/entities/inscricoes-educacao,entity';

@Injectable()
export class InscricaoEducacaoService {
  constructor(
    @InjectRepository(InscricaoEducacao)
    private inscricaoEducacaoRepository: Repository<InscricaoEducacao>
  ) { }
  async create(dto: CreateInscricaoEducacaoDto, files: Express.Multer.File[]) {
    const candidate = await this.findByCpf(dto.cpf);
    if (candidate) {
      throw new ConflictException('Candidato já cadastrado!');
    }

    const novaInscricao = this.inscricaoEducacaoRepository.create(dto);
    let pontuacao = 0; // Iniciamos a pontuação em 0

    if (files) {
      files.forEach((file) => {
        const fileUrl = `http://localhost:3000/uploads/${file.filename}`;
        switch (file.fieldname) {
          case 'ensinoFundamental':
            novaInscricao.ensinoFundamental = fileUrl;
            pontuacao += 10;
            break;
          case 'ensinoMedio':
            novaInscricao.ensinoMedio = fileUrl;
            pontuacao += 10;
            break;
          case 'ensinoSuperior':
            novaInscricao.ensinoSuperior = fileUrl;
            pontuacao += 10;
            break;
          case 'cursoEducacao':
            novaInscricao.cursoAreaEducacao = fileUrl;
            pontuacao += 10;
            break;
          case 'doutorado':
            novaInscricao.doutorado = fileUrl;
            pontuacao += 10;
            break;
        }
      });
    }

    // 🎯 Calcular pontuação baseada no tempo de experiência
    if (dto.tempoExperiencia) {
      if (dto.tempoExperiencia >= 3) {
        pontuacao += 30;
      } else if (dto.tempoExperiencia >= 2) {
        pontuacao += 20;
      } else if (dto.tempoExperiencia >= 1) {
        pontuacao += 10;
      }
    }

    novaInscricao.pontuacao = pontuacao; // 🔥 Atribuindo a pontuação calculada
    return await this.inscricaoEducacaoRepository.save(novaInscricao);
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
