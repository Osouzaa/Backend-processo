import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
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
      cpfFile?: Express.Multer.File[];
      comprovanteEndereco?: Express.Multer.File[];
      comprovanteReservista?: Express.Multer.File[];
      laudoPcd?: Express.Multer.File[];
      comprovanteExperiencia?: Express.Multer.File[];
    },
    user: CurrentUser
  ) {

    console.log('Usuário logado:', user);
    const candidateRegistered = await this.candidatoRepo.findOne({
      where: {
        id: user.sub
      }
    })

    if (!candidateRegistered) {
      throw new ConflictException('Candidato nao cadastrado!');
    }

    // const candidate = await this.findByCpf(dto.cpf);
    // // if (candidate) {
    // //   throw new ConflictException('Candidato já cadastrado!');
    // // }

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

    if (files.laudoPcd?.length) {
      const fileName = 'comprovante_laudopcd.pdf';
      const filePath = path.join(userDir, fileName);
      fs.writeFileSync(filePath, files.laudoPcd[0].buffer);

      savedFiles['comprovante_laudopcd'] = `${this.BASE_URL}/${userFolder}/${fileName}`;
    }
    if (files.comprovanteExperiencia?.length) {
      const fileName = 'comprovante_experiencia.pdf';
      const filePath = path.join(userDir, fileName);
      fs.writeFileSync(filePath, files.comprovanteExperiencia[0].buffer);

      savedFiles['comprovanteExperiencia'] = `${this.BASE_URL}/${userFolder}/${fileName}`;
    }

    const pontuacaoCalculada = calcularPontuacao(dto);

    const novaInscricao = this.inscricaoEducacaoRepository.create({
      ...dto,
      pontuacao: pontuacaoCalculada,
      cpfLink: savedFiles['cpfFile'],
      comprovanteEnderecoLink: savedFiles['comprovanteEndereco'],
      certificadoReservistaLink: savedFiles['comprovanteReservista'],
      laudoPcd: savedFiles['comprovante_laudopcd'],
      comprovanteExperienciaLink: savedFiles['comprovanteExperiencia'],
      candidato: candidateRegistered,
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
  async findAll(query: QueryInscricaoEducacaoDto & { page?: number }) {
    try {
      const {
        cpf,
        escolaridade,
        cargoFuncao,
        nomeCompleto,
        page = 1,
      } = query;

      const take = 20;
      const skip = (page - 1) * take;

      const qb = this.inscricaoEducacaoRepository.createQueryBuilder('inscricao');

      // Filtros
      if (cpf) {
        qb.andWhere(
          "REPLACE(REPLACE(REPLACE(inscricao.cpf, '.', ''), '-', ''), ' ', '') = :cpf",
          { cpf: cpf.replace(/\D/g, '') }
        );
      }

      if (escolaridade) {
        qb.andWhere('inscricao.escolaridade = :escolaridade', { escolaridade });
      }

      if (cargoFuncao) {
        qb.andWhere('inscricao.cargoFuncao = :cargoFuncao', { cargoFuncao });

        // Ordenação com critérios de desempate
        qb.addOrderBy('inscricao.pontuacao', 'DESC')
          .addOrderBy(
            `CASE WHEN EXTRACT(YEAR FROM AGE(CURRENT_DATE, TO_DATE(inscricao.dataNascimento, 'YYYY-MM-DD'))) >= 60 THEN 1 ELSE 2 END`,
            'ASC'
          )
          .addOrderBy('inscricao.totalDeDias', 'DESC')
          .addOrderBy(
            `EXTRACT(YEAR FROM AGE(CURRENT_DATE, TO_DATE(inscricao.dataNascimento, 'YYYY-MM-DD')))`,
            'DESC'
          );
      }

      if (nomeCompleto) {
        qb.andWhere('LOWER(inscricao.nomeCompleto) LIKE LOWER(:nomeCompleto)', {
          nomeCompleto: `%${nomeCompleto}%`,
        });
      }

      qb.skip(skip).take(take);

      const [data, total] = await qb.getManyAndCount();

      let classificacoes: Record<number, number> = {};

      // Se for filtrado por cargo, calcula a classificação
      if (cargoFuncao) {
        const classificacaoQuery = this.inscricaoEducacaoRepository
          .createQueryBuilder('inscricao')
          .select([
            'inscricao.id',
            'inscricao.nomeCompleto',
            'inscricao.pontuacao',
            'inscricao.dataNascimento',
            'inscricao.totalDeDias',
          ])
          .addSelect(
            `EXTRACT(YEAR FROM AGE(CURRENT_DATE, TO_DATE(inscricao.dataNascimento, 'YYYY-MM-DD')))`,
            'idade'
          )
          .where('inscricao.cargoFuncao = :cargoFuncao', { cargoFuncao });

        const rawResult = await classificacaoQuery.getRawMany();

        // Ordena com os critérios definidos
        const ordenadoComEducacao = rawResult
          .map((item) => {
            const idade = parseInt(item.idade);
            const pontuacao = Number(item.inscricao_pontuacao);
            const totalDeDias = Number(item.inscricao_totalDeDias);

            return {
              ...item,
              idade,
              pontuacao,
              totalDeDias,
            };
          })
          .sort((a, b) => {
            // 1. Maior pontuação
            if (b.pontuacao !== a.pontuacao) return b.pontuacao - a.pontuacao;

            // 2. Prioridade para idosos
            const isAIdoso = a.idade >= 60;
            const isBIdoso = b.idade >= 60;
            if (isAIdoso !== isBIdoso) return isAIdoso ? -1 : 1;

            // 3. Maior pontuação de educação
            if (b.pontosEducacao !== a.pontosEducacao) return b.pontosEducacao - a.pontosEducacao;

            // 4. Maior total de dias
            if (b.totalDeDias !== a.totalDeDias) return b.totalDeDias - a.totalDeDias;

            // 5. Maior idade
            return b.idade - a.idade;
          });

        // Atribui classificação
        classificacoes = ordenadoComEducacao.reduce((acc, row, index) => {
          acc[row.inscricao_id] = index + 1;
          return acc;
        }, {});
      }

      // Aplica classificação e pontos de educação na resposta final
      const dataComClassificacao = data.map((item) => ({
        ...item,
        classificacao: classificacoes[item.id] || null,
        // pontosEducacao: calcularPontosEducacao(item),
      }));

      return {
        data: dataComClassificacao,
        total,
        page,
        pageCount: Math.ceil(total / take),
      };
    } catch (error) {
      console.error('Erro ao buscar inscrições:', error);
      throw new Error('Erro ao buscar inscrições.');
    }
  }



  async exportToExcel(): Promise<Uint8Array> {
    const inscricoes = await this.inscricaoEducacaoRepository.find({ relations: ['files'] });

    const workbook = new ExcelJs.Workbook();
    const worksheet = workbook.addWorksheet('Inscrições');

    // Descobrir quantos arquivos no máximo tem entre as inscrições
    const maxArquivos = Math.max(...inscricoes.map(i => i.files?.length ?? 0));

    const headersBase = [
      'ID', 'Criado em', 'Atualizado em', 'Nome Completo', 'Pontuação', 'Escolaridade', 'Data de Nascimento',
      'RG', 'CPF', 'Link CPF', 'Gênero', 'Email', 'Certificado Reservista', 'Link Certificado Reservista',
      'Nacionalidade', 'Naturalidade', 'Estado Civil', 'PCD', 'Laudo PCD', 'Vaga Destinada a PCD',
      'Cargo/Função', 'Telefone Fixo', 'Celular', 'CEP', 'Logradouro', 'Complemento', 'Número',
      'Bairro', 'Cidade', 'Estado', 'Comprovante Endereço Link',
      'Ensino Fundamental', 'Ensino Médio', 'Ensino Superior', 'Qtde Ensino Superior',
      'Curso Área Educação', 'Qtde Curso Área Educação',
      'Doutorado', 'Mestrado', 'Especialização', 'Qtde Especialização',
      'Tempo de Experiência',
    ];

    const headersArquivos = Array.from({ length: maxArquivos }, (_, i) => `Arquivo ${i + 1}`);

    const headers = [...headersBase, ...headersArquivos];

    worksheet.addRow(headers);

    // Congelar o cabeçalho
    worksheet.views = [{ state: 'frozen', ySplit: 1 }];

    inscricoes.forEach(inscricao => {
      const arquivos = inscricao.files?.map(file => file.path) ?? [];
      const linha = [
        inscricao.id,
        this.formatDate(inscricao.criadoEm),
        this.formatDate(inscricao.atualizadoEm),
        inscricao.nomeCompleto,
        inscricao.pontuacao ?? '',
        inscricao.escolaridade ?? '',
        this.formatDate(inscricao.dataNascimento),
        inscricao.rg ?? '',
        inscricao.cpf,
        inscricao.cpfLink,
        inscricao.genero,
        inscricao.email ?? '',
        inscricao.certificadoReservista ?? '',
        inscricao.certificadoReservistaLink ?? '',
        inscricao.nacionalidade,
        inscricao.naturalidade,
        inscricao.estadoCivil,
        inscricao.pcd ?? '',
        inscricao.laudoPcd ?? '',
        inscricao.vagaDestinadaAPCD ?? '',
        inscricao.cargoFuncao,
        inscricao.contatoTelefoneFixo ?? '',
        inscricao.contatoCelular ?? '',
        inscricao.cep,
        inscricao.logradouro,
        inscricao.complemento ?? '',
        inscricao.numero,
        inscricao.bairro,
        inscricao.cidade,
        inscricao.estado,
        inscricao.comprovanteEnderecoLink,
        inscricao.possuiEnsinoFundamental ?? '',
        inscricao.possuiEnsinoMedio ?? '',
        inscricao.possuiEnsinoSuperior ?? '',
        inscricao.quantidadeEnsinoSuperior ?? '',
        inscricao.possuiCursoAreaEducacao ?? '',
        inscricao.quantidadeCursoAreaEducacao ?? '',
        inscricao.possuiDoutorado ?? '',
        inscricao.possuiMestrado ?? '',
        inscricao.possuiEspecializacao ?? '',
        inscricao.quantidadeEspecilizacao ?? '',
        inscricao.tempoExperiencia ?? '',
        ...arquivos,
      ];

      worksheet.addRow(linha);
    });

    worksheet.columns.forEach((column, index) => {
      column.width = headers[index].length < 20 ? headers[index].length + 5 : 25;
      column.alignment = { vertical: 'middle', horizontal: 'left' };
    });

    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
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
      throw new NotFoundException('Candidato nao encontrado');
    }

    if (dto.daysUpdated) {
      candidate.totalDeDias = dto.daysUpdated
    }

    candidate.pontuacao = dto.pontucaoAtual

    await this.inscricaoEducacaoRepository.save(candidate)
  }

  update(id: number, updateInscricaoEducacaoDto: UpdateInscricaoEducacaoDto) {
    return `Esta ação atualiza a inscrição #${id}`;
  }

  remove(id: number) {
    return `Esta ação remove a inscrição #${id}`;
  }
}
