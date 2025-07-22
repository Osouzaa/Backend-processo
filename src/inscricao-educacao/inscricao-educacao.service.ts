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
import type { AddAvaliableCandidateDto } from './dto/add-avaliable-candidte.dto';
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
      cotaRacialLink?: Express.Multer.File[];
    },
    user: CurrentUser
  ) {
    // Verifica se candidato está cadastrado
    const candidateRegistered = await this.candidatoRepo.findOne({
      where: { id: user.sub },
    });

    if (!candidateRegistered) {
      throw new ConflictException('Candidato não cadastrado!');
    }


    // Função para gerar número único da inscrição
    const gerarNumeroInscricao = (): string => {
      const ano = new Date().getFullYear().toString().slice(-2); // Ex: "25"
      const random = Math.floor(100000 + Math.random() * 900000); // 6 dígitos aleatórios
      return `EDU-${ano}-${random}`;
    };

    // Função para sanitizar strings (remover acentos, espaços, caracteres especiais)
    const sanitize = (str: string) =>
      str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, '_')
        .replace(/[^\w\s]/gi, '');

    // Pasta base do candidato, sempre a mesma
    const nomeSanitizado = sanitize(candidateRegistered.nome);
    const cpfSanitizado = candidateRegistered.cpf.replace(/\D/g, '');
    const userFolder = `${nomeSanitizado}_${cpfSanitizado}`;
    const userDir = path.join(__dirname, '../../uploads', userFolder);

    // Cria pasta se não existir (reusa se existir)
    if (!fs.existsSync(userDir)) {
      fs.mkdirSync(userDir, { recursive: true });
    }

    // Função para salvar arquivo, sobrescrevendo se já existir
    const saveFile = (file: Express.Multer.File, fileName: string) => {
      const filePath = path.join(userDir, fileName);
      fs.writeFileSync(filePath, file.buffer);
      return `${this.BASE_URL}/${userFolder}/${fileName}`;
    };

    // Objeto para armazenar os caminhos dos arquivos salvos
    const savedFiles: { [key: string]: string } = {};

    if (files.cpfLink?.length) {
      savedFiles['cpfLink'] = saveFile(files.cpfLink[0], 'cpf.pdf');
    }

    if (files.cotaRacialLink?.length) {
      savedFiles['cotaRacialLink'] = saveFile(files.cotaRacialLink[0], 'Documento_de_Cota_Racial.pdf');
    }

    if (files.comprovanteEnderecoLink?.length) {
      savedFiles['comprovanteEnderecoLink'] = saveFile(files.comprovanteEnderecoLink[0], 'comprovante_endereco.pdf');
    }

    if (files.certificadoReservistaLink?.length) {
      savedFiles['certificadoReservistaLink'] = saveFile(files.certificadoReservistaLink[0], 'comprovante_reservista.pdf');
    }

    if (files.laudoPcd?.length) {
      savedFiles['laudoPcd'] = saveFile(files.laudoPcd[0], 'comprovante_laudopcd.pdf');
    }

    // Calcula pontuação baseado nos dados da inscrição (presumo que essa função existe)
    const pontuacaoCalculada = calcularPontuacao(dto);
    // Cria a nova inscrição com dados + caminhos dos arquivos
    const novaInscricao = this.inscricaoEducacaoRepository.create({
      ...dto,
      nomeCompleto: candidateRegistered.nome,
      cpf: candidateRegistered.cpf,
      email: candidateRegistered.email,
      contatoCelular: candidateRegistered.celular,
      pontuacao: pontuacaoCalculada,
      cpfLink: savedFiles['cpfLink'],
      comprovanteEnderecoLink: savedFiles['comprovanteEnderecoLink'],
      certificadoReservistaLink: savedFiles['certificadoReservistaLink'],
      laudoPcd: savedFiles['laudoPcd'],
      cotaRacialLink: savedFiles['cotaRacialLink'],
      candidato: candidateRegistered,
      numeroInscricao: gerarNumeroInscricao(),
    });

    // Salva no banco
    await this.inscricaoEducacaoRepository.save(novaInscricao);

    // Retorna os dados principais
    return {
      id: novaInscricao.id,
      pontuacao: novaInscricao.pontuacao,
      numeroInscricao: novaInscricao.numeroInscricao,
      nomeCompleto: novaInscricao.nomeCompleto,
      escolaridade: novaInscricao.escolaridade,
      cargoFuncao: novaInscricao.cargoFuncao,
      dataDoCadastro: novaInscricao.criadoEm,
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
      limit,
    } = query;

    const take = limit || 20;
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
      // Se o filtro for 'Sim', busca todos que não sejam 'Não Possui' ou nulos/vazios
      if (pcd === 'Sim') {
        qb.andWhere("inscricao.pcd IS NOT NULL AND inscricao.pcd NOT IN (:...pcdValues)", { 
          pcdValues: ['Não Possui', ''] 
        });
      } else {
        // Se for enviado outro valor para pcd, mantém o filtro exato (opcional)
        qb.andWhere('inscricao.pcd = :pcd', { pcd });
      }
    }
    if (cargoFuncao) {
      qb.andWhere('inscricao.cargoFuncao = :cargoFuncao', { cargoFuncao });
    }

    // 🔄 Busca todos os dados filtrados
    const todosDados = await qb.getMany();

    // 🧠 Adiciona campos auxiliares
    const dadosComExtras = todosDados.map((item) => {
      const idade = this.calcularIdade(item.dataNascimento);
      const pontosEducacao = calcularPontosEducacao(item, item.escolaridade);
      return {
        ...item,
        idade,
        pontosEducacao,
      };
    });

    // 🏁 Ordena com os novos critérios de desempate
    const ordenados = dadosComExtras.sort((a, b) => {
      // ==================================================================
      // NOVO: 1º Critério - Jogar desclassificados para o fim
      // ==================================================================
      const aIsDisqualified = a.status === 'Desclassificado';
      const bIsDisqualified = b.status === 'Desclassificado';

      if (aIsDisqualified !== bIsDisqualified) {
        // Se 'a' for desclassificado, ele vai para depois de 'b' (retorna 1).
        // Se 'b' for desclassificado, ele vai para depois de 'a' (retorna -1).
        return aIsDisqualified ? 1 : -1;
      }

      // Critérios antigos continuam se não houver diferença no status
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

    // ==================================================================
    // NOVO: Paginação condicional
    // ==================================================================
    let paginatedData = dadosClassificados;
    let totalPages = 1;
    let currentPage = 1;

    // Só aplica paginação se NÃO estiver filtrando por um cargo/função específico
    if (!cargoFuncao) {
      paginatedData = dadosClassificados.slice(skip, skip + take);
      totalPages = Math.ceil(dadosClassificados.length / take);
      currentPage = page;
    }

    return {
      data: paginatedData,
      total: dadosClassificados.length,
      page: currentPage,
      pageCount: totalPages,
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
      'ID', 'Classificação', 'Data de Inscrição', 'Número da Inscrição', 'Nome Completo', 'CPF', 'Vaga de Inscrição', 'Pontuação', 'Total de dias', 'PTS Educação',
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
        inscricao.pontuacao,
        inscricao.totalDeDias,
        inscricao.pontosEducacao
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

  async addStatus(
    id: number,
    dto: AddAvaliableCandidateDto,
  ): Promise<InscricaoEducacao> { // O tipo de retorno também deve ser InscricaoEducacao
    // 1. Busca a inscrição pelo ID fornecido.
    //    (Variável renomeada para 'inscricao' para maior clareza)
    const inscricao = await this.inscricaoEducacaoRepository.findOne({
      where: { id },
    });

    // 2. Se a inscrição não for encontrada, lança um erro 404.
    if (!inscricao) {
      throw new NotFoundException(`Inscrição com ID ${id} não encontrada.`);
    }

    // 3. Atribui os novos valores à inscrição.
    inscricao.status = dto.status;
    inscricao.obs = dto.obs;

    // 4. Salva a INSCRIÇÃO com as informações atualizadas no banco de dados.
    //    👇 CORREÇÃO PRINCIPAL: use o repositório correto.
    return this.inscricaoEducacaoRepository.save(inscricao);
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

  async remove(id: number) {
    const inscricao = await this.inscricaoEducacaoRepository.findOne({
      where: {
        id
      }
    })
    if (!inscricao) {
      throw new NotFoundException('Inscrição nao encontrada');
    }

    await this.inscricaoEducacaoRepository.remove(inscricao);
  }
}
