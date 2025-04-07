import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { File } from 'src/db/entities/file.entity';
import * as fs from "fs";
import * as path from "path";
import { CreateFileDto } from "./dto/create.file.dto";
import { InscricaoEducacaoService } from 'src/inscricao-educacao/inscricao-educacao.service';
import { env } from 'src/env';

@Injectable()
export class FilesService {
  private readonly logger = new Logger(FilesService.name);

  private readonly BASE_URL = env.BASE_URL; // Altere aqui para seu IP ou domínio

  constructor(
    @InjectRepository(File)
    private filesRepository: Repository<File>,
    private inscricaoService: InscricaoEducacaoService
  ) { }

  private getUserDirInfo(nome: string, cpf: string) {
    const sanitize = (str: string) =>
      str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "_").replace(/[^\w\s]/gi, "");

    const nomeSanitizado = sanitize(nome);
    const cpfSanitizado = cpf.replace(/\D/g, "");
    const folderName = `${nomeSanitizado}_${cpfSanitizado}`;
    const userDir = path.join(__dirname, '../../uploads', folderName);
    const publicPathPrefix = `${this.BASE_URL}/${folderName}`;

    if (!fs.existsSync(userDir)) {
      fs.mkdirSync(userDir, { recursive: true });
    }

    return { userDir, publicPathPrefix };
  }

  async create(dto: CreateFileDto, file: Express.Multer.File) {
    const inscricao = await this.inscricaoService.findOne(+dto.inscricaoId);
    if (!inscricao) throw new Error("Inscrição não encontrada!");

    const { userDir, publicPathPrefix } = this.getUserDirInfo(inscricao.nomeCompleto, inscricao.cpf);

    const fileName = "comprovante_ensino_medio.pdf";
    const filePath = path.join(userDir, fileName);
    fs.writeFileSync(filePath, file.buffer);

    const newFile = this.filesRepository.create({
      fileName,
      path: `${publicPathPrefix}/${fileName}`,
      inscricao: inscricao,
    });

    await this.filesRepository.save(newFile);
    return { message: "Arquivo salvo com sucesso!", file: newFile };
  }

  async createUploadGraduacao(dto: CreateFileDto, files: Express.Multer.File[]) {
    const inscricao = await this.inscricaoService.findOne(+dto.inscricaoId);
    if (!inscricao) throw new Error("Inscrição não encontrada!");

    const { userDir, publicPathPrefix } = this.getUserDirInfo(inscricao.nomeCompleto, inscricao.cpf);

    const savedFiles = await Promise.all(
      files.map(async (file, index) => {
        const fileName = `Comprovante_Graduacao_${index + 1}.pdf`;
        const filePath = path.join(userDir, fileName);
        fs.writeFileSync(filePath, file.buffer);

        const newFile = this.filesRepository.create({
          fileName,
          path: `${publicPathPrefix}/${fileName}`,
          inscricao: inscricao,
        });

        return this.filesRepository.save(newFile);
      })
    );

    return { message: "Arquivos salvos com sucesso!", files: savedFiles };
  }

  async createUploadDoutorado(dto: CreateFileDto, file: Express.Multer.File) {
    const inscricao = await this.inscricaoService.findOne(+dto.inscricaoId);
    if (!inscricao) throw new Error("Inscrição não encontrada!");

    const { userDir, publicPathPrefix } = this.getUserDirInfo(inscricao.nomeCompleto, inscricao.cpf);

    const fileName = "comprovante-doutorado.pdf";
    const filePath = path.join(userDir, fileName);
    fs.writeFileSync(filePath, file.buffer);

    const newFile = this.filesRepository.create({
      fileName,
      path: `${publicPathPrefix}/${fileName}`,
      inscricao: inscricao,
    });

    await this.filesRepository.save(newFile);
    return { message: "Arquivo salvo com sucesso!", file: newFile };
  }

  async uploadCursoEducacao(dto: CreateFileDto, file: Express.Multer.File) {
    const inscricao = await this.inscricaoService.findOne(+dto.inscricaoId);
    if (!inscricao) throw new Error("Inscrição não encontrada!");

    const { userDir, publicPathPrefix } = this.getUserDirInfo(inscricao.nomeCompleto, inscricao.cpf);

    const fileName = "comprovante-curso-educação.pdf";
    const filePath = path.join(userDir, fileName);
    fs.writeFileSync(filePath, file.buffer);

    const newFile = this.filesRepository.create({
      fileName,
      path: `${publicPathPrefix}/${fileName}`,
      inscricao: inscricao,
    });

    await this.filesRepository.save(newFile);
    return { message: "Arquivo salvo com sucesso!", file: newFile };
  }

  async uploadMestrado(dto: CreateFileDto, files: Express.Multer.File[]) {
    const inscricao = await this.inscricaoService.findOne(+dto.inscricaoId);
    if (!inscricao) throw new Error("Inscrição não encontrada!");

    const { userDir, publicPathPrefix } = this.getUserDirInfo(inscricao.nomeCompleto, inscricao.cpf);

    const savedFiles: File[] = [];

    for (const file of files) {
      const fileSuffix = file.originalname.toLowerCase().includes('verso') ? 'verso' : 'frente';
      const fileName = `mestrado-${fileSuffix}.pdf`;
      const filePath = path.join(userDir, fileName);

      fs.writeFileSync(filePath, file.buffer);

      const newFile = this.filesRepository.create({
        fileName,
        path: `${publicPathPrefix}/${fileName}`,
        inscricao: inscricao,
      });

      const savedFile = await this.filesRepository.save(newFile);
      savedFiles.push(savedFile);
    }

    return {
      message: "Arquivos salvos com sucesso!",
      files: savedFiles,
    };
  }

  async uploadEspecializacao(dto: CreateFileDto, files: Express.Multer.File[]) {
    const inscricao = await this.inscricaoService.findOne(+dto.inscricaoId);
    if (!inscricao) throw new Error("Inscrição não encontrada!");

    const { userDir, publicPathPrefix } = this.getUserDirInfo(inscricao.nomeCompleto, inscricao.cpf);

    const tipos = ['frente', 'verso'];

    const savedFiles = [];

    files.forEach(async (file, index) => {
      const tipo = tipos[index] || `extra${index}`;
      const fileName = `especializacao-${tipo}.pdf`;
      const filePath = path.join(userDir, fileName);
      const savedFiles: File[] = [];
      fs.writeFileSync(filePath, file.buffer);

      const newFile = this.filesRepository.create({
        fileName,
        path: `${publicPathPrefix}/${fileName}`,
        inscricao: inscricao,
      });

      const savedFile = await this.filesRepository.save(newFile);
      savedFiles.push(savedFile);
    });

    return {
      message: "Arquivos salvos com sucesso!",
    };
  }
}
