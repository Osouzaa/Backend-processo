import { Injectable, ConflictException, NotFoundException, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { InscricaoEducacao } from 'src/db/entities/inscricoes-educacao.entity';
import type { CreateInscricaoEducacaoDto } from './dto/create-inscricao-educacao.dto';
import type { UpdateInscricaoEducacaoDto } from './dto/update-inscricao-educacao.dto';
import { calcularPontuacao } from 'src/utils/calc-pontuacao';
import { env } from 'src/env';
import type { QueryInscricaoEducacaoDto } from './dto/query-inscricao-educacao.dto';
import * as ExcelJs from "exceljs"
import { Candidato } from 'src/db/entities/candidato.entity';
import type { CurrentUser } from 'src/decorators/currentUser.decorator';
import type { UpdateScoreDto } from './dto/update-score.dto';
import { calcularPontosEducacao } from 'src/utils/calcularPontosEducacao';
@Injectable()
export class InscricaoEducacaoService {
  private readonly BASE_URL = env.BASE_URL
  constructor(
    @InjectRepository(InscricaoEducacao)
    private readonly inscricaoEducacaoRepository: Repository<InscricaoEducacao>,

    @InjectRepository(Candidato)
    private readonly candidatoRepo: Repository<Candidato>,

  ) { }


  async create(
    dto: CreateInscricaoEducacaoDto,
    files: {
      cpfLink?: Express.Multer.File[];
      comprovanteEnderecoLink?: Express.Multer.File[];
      certificadoReservistaLink?: Express.Multer.File[];
      laudoPcd?: Express.Multer.File[];
      cotaRacialLink?: Express.Multer.File[]
    },
    user: CurrentUser
  ) {

    const candidateRegistered = await this.candidatoRepo.findOne({
      where: {
        id: user.sub
      }
    })

    if (!candidateRegistered) {
      throw new ConflictException('Candidato nao cadastrado!');
    }
    const gerarNumeroInscricao = (): string => {
      const ano = new Date().getFullYear().toString().slice(-2); // Ex: "25" para 2025
      const random = Math.floor(100000 + Math.random() * 900000); // número entre 100000 e 999999
      return `EDU-${ano}-${random}`;
    };

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

    if (files.cpfLink?.length) {
      const fileName = 'cpf.pdf';
      const filePath = path.join(userDir, fileName);
      fs.writeFileSync(filePath, files.cpfLink[0].buffer);

      savedFiles['cpfFile'] = `${this.BASE_URL}/${userFolder}/${fileName}`;
    }


    if (files.cotaRacialLink?.length) {
      const fileName = 'Documento de Cota Racial.pdf';
      const filePath = path.join(userDir, fileName);
      fs.writeFileSync(filePath, files.cotaRacialLink[0].buffer);

      savedFiles['cotaRacialLink'] = `${this.BASE_URL}/${userFolder}/${fileName}`;
    }

    if (files.comprovanteEnderecoLink?.length) {
      const fileName = 'comprovante_endereco.pdf';
      const filePath = path.join(userDir, fileName);
      fs.writeFileSync(filePath, files.comprovanteEnderecoLink[0].buffer);

      savedFiles['comprovanteEndereco'] = `${this.BASE_URL}/${userFolder}/${fileName}`;
    }

    if (files.certificadoReservistaLink?.length) {
      const fileName = 'comprovante_reservista.pdf';
      const filePath = path.join(userDir, fileName);
      fs.writeFileSync(filePath, files.certificadoReservistaLink[0].buffer);

      savedFiles['comprovanteReservista'] = `${this.BASE_URL}/${userFolder}/${fileName}`;
    }

    if (files.laudoPcd?.length) {
      const fileName = 'comprovante_laudopcd.pdf';
      const filePath = path.join(userDir, fileName);
      fs.writeFileSync(filePath, files.laudoPcd[0].buffer);

      savedFiles['comprovante_laudopcd'] = `${this.BASE_URL}/${userFolder}/${fileName}`;
    }
    const pontuacaoCalculada = calcularPontuacao(dto);

    const novaInscricao = this.inscricaoEducacaoRepository.create({
      ...dto,
      pontuacao: pontuacaoCalculada,
      cpfLink: savedFiles['cpfFile'],
      comprovanteEnderecoLink: savedFiles['comprovanteEndereco'],
      certificadoReservistaLink: savedFiles['comprovanteReservista'],
      laudoPcd: savedFiles['comprovante_laudopcd'],
      cotaRacialLink: savedFiles['cotaRacialLink'],
      candidato: candidateRegistered,
      numeroInscricao: gerarNumeroInscricao(),
    });


    await this.inscricaoEducacaoRepository.save(novaInscricao);

    return {
      id: novaInscricao.id,
      pontuacao: novaInscricao.pontuacao,
      numeroInscricao: novaInscricao.numeroInscricao,
      nomeCompleto: novaInscricao.nomeCompleto,
      escolaridade: novaInscricao.escolaridade,
      cargoFuncao: novaInscricao.cargoFuncao,
      dataDoCadastro: novaInscricao.criadoEm
    };
  }

  async findByCpf(cpf: string) {
    return this.inscricaoEducacaoRepository.findOne({ where: { cpf } });
  }
  async findAll(query: QueryInscricaoEducacaoDto & { page?: number }) {
    try {
      const {
        cpf,
        escolaridade,
        cargoFuncao,
        nomeCompleto,
        cotaRacial,
        pcd,
        page = 1,
      } = query;

      const take = 20;
      const skip = (page - 1) * take;

      const qb = this.inscricaoEducacaoRepository.createQueryBuilder('inscricao');

      // 🔍 Filtros
      if (cpf) {
        qb.andWhere(
          "REPLACE(REPLACE(REPLACE(inscricao.cpf, '.', ''), '-', ''), ' ', '') = :cpf",
          { cpf: cpf.replace(/\D/g, '') }
        );
      }

      if (escolaridade) {
        qb.andWhere('inscricao.escolaridade = :escolaridade', { escolaridade });
      }

      if (cotaRacial) {
        qb.andWhere('inscricao.cotaRacial = :cotaRacial', { cotaRacial });
      }

      if (pcd) {
        qb.andWhere('inscricao.pcd = :pcd', { pcd });
      }

      if (cargoFuncao) {
        qb.andWhere('inscricao.cargoFuncao = :cargoFuncao', { cargoFuncao });
      }

      // 🔄 Busca todos os dados filtrados (sem paginação ainda!)
      const todosDados = await qb.getMany();

      // 🧠 Adiciona campos auxiliares (pontuação, idade, totalDeDias, etc)
      const dadosComExtras = todosDados.map((item) => {
        const idade = this.calcularIdade(item.dataNascimento);
        const pontosEducacao = calcularPontosEducacao(item, item.escolaridade);
        return {
          ...item,
          idade,
          pontosEducacao,
        };
      });

      // 🏁 Ordena com os critérios de desempate
      const ordenados = dadosComExtras.sort((a, b) => {
        if (b.pontuacao !== a.pontuacao) return b.pontuacao - a.pontuacao;

        const isAIdoso = a.idade >= 60;
        const isBIdoso = b.idade >= 60;
        if (isAIdoso !== isBIdoso) return isAIdoso ? -1 : 1;

        if (b.pontosEducacao !== a.pontosEducacao) return b.pontosEducacao - a.pontosEducacao;

        if (b.totalDeDias !== a.totalDeDias) return b.totalDeDias - a.totalDeDias;

        return b.idade - a.idade;
      });

      // 🎯 Atribui classificação
      const dadosClassificados = ordenados.map((item, index) => ({
        ...item,
        classificacao: index + 1,
      }));

      // 📄 Paginação manual
      const paginados = dadosClassificados.slice(skip, skip + take);

      return {
        data: paginados,
        total: dadosClassificados.length,
        page,
        pageCount: Math.ceil(dadosClassificados.length / take),
      };
    } catch (error) {
      console.error('Erro ao buscar inscrições:', error);
      throw new Error('Erro ao buscar inscrições.');
    }
  }

  private calcularIdade(dataNascimento: string): number {
    const nascimento = new Date(dataNascimento);
    const hoje = new Date();
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mes = hoje.getMonth() - nascimento.getMonth();
    if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
      idade--;
    }
    return idade;
  }

  async exportArrayToExcel(data: any[]): Promise<Uint8Array> {
    const workbook = new ExcelJs.Workbook();
    const worksheet = workbook.addWorksheet('Inscrições');

    const headers = [
      'ID', 'Classificação', 'Data de Inscrição', 'Número da Inscrição', 'Nome Completo', 'CPF', 'Vaga de Inscrição',
    ];

    const headerRow = worksheet.addRow(headers);
    headerRow.eachCell((cell) => {
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF851F2C' },
      };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });

    worksheet.views = [{ state: 'frozen', ySplit: 1 }];
    worksheet.getRow(1).height = 25;

    data.forEach((inscricao, index) => {
      const linha = [
        inscricao.id,
        inscricao.classificacao,
        this.formatDate(inscricao.criadoEm),
        inscricao.numeroInscricao,
        inscricao.nomeCompleto,
        this.maskCpf(inscricao.cpf),
        inscricao.cargoFuncao,
      ];

      const row = worksheet.addRow(linha);

      const fillColor = index % 2 === 0 ? 'FFFFFFFF' : 'FFF5F5F5';
      row.eachCell((cell) => {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: fillColor },
        };
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
        cell.alignment = { vertical: 'middle', horizontal: 'left' };
      });
    });

    worksheet.columns.forEach((column, index) => {
      column.width = headers[index].length < 20 ? headers[index].length + 5 : 25;
    });

    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  }
  private maskCpf(cpf: string): string {
    const digits = cpf.replace(/\D/g, '');
    if (digits.length !== 11) return cpf;

    return `${digits.slice(0, 3)}*****${digits.slice(9, 11)}`;
  }
  private formatDate(date: Date | string | null): string {
    if (!date) return '';
    const d = new Date(date);
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
  }
  async findOne(id: number) {
    const inscricao = await this.inscricaoEducacaoRepository.findOne({ where: { id }, relations: ['files'] });

    if (!inscricao) {
      throw new Error('Inscrição não encontrada');
    }

    return inscricao;
  }

  async updateScore(id: number, dto: UpdateScoreDto) {
    const candidate = await this.findOne(id);

    if (!candidate) {
      throw new NotFoundException('Candidato não encontrado');
    }

    if (candidate.avaliado === true) {
      throw new BadRequestException('Candidato ja avaliado');
    }

    // Atualizando os campos do candidato com os dados do DTO
    Object.assign(candidate, {
      totalDeDias: dto.diasTrabalhados,
      pontuacao: dto.pontuacao,
      possuiCursoAreaEducacao: String(dto.possuiCursoAreaEducacao),
      possuiDoutorado: String(dto.possuiDoutorado),
      possuiEnsinoMedio: String(dto.possuiEnsinoMedio),
      possuiEnsinoSuperior: String(dto.possuiEnsinoSuperior),
      possuiEspecializacao: String(dto.possuiEspecializacao),
      possuiMestrado: String(dto.possuiMestrado),
      quantidadeCursoAreaEducacao: dto.quantidadeCursoAreaEducacao,
      quantidadeEnsinoSuperior: dto.quantidadeEnsinoSuperior,
      quantidadeEspecilizacao: dto.quantidadeEspecilizacao,
      avaliado: true
    });

    await this.inscricaoEducacaoRepository.save(candidate);

    return candidate; // Retorna o candidato atualizado
  }

  async update(
    id: number,
    updateInscricaoEducacaoDto: UpdateInscricaoEducacaoDto
  ): Promise<string> {
    const inscricao = await this.inscricaoEducacaoRepository.findOne({ where: { id } });

    if (!inscricao) {
      throw new Error(`Inscrição com ID ${id} não encontrada.`);
    }

    // Calcula a pontuação com base no DTO
    const pontuacaoCalculada = calcularPontuacao(updateInscricaoEducacaoDto);

    Object.assign(inscricao, updateInscricaoEducacaoDto, {
      pontuacao: pontuacaoCalculada,
    });

    await this.inscricaoEducacaoRepository.save(inscricao);

    return `A inscrição #${id} foi atualizada com sucesso.`;
  }

  remove(id: number) {
    return `Esta ação remove a inscrição #${id}`;
  }
}
