import { Injectable, Logger, NotFoundException } from '@nestjs/common';
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
  private readonly BASE_URL = env.BASE_URL;

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

  async create(dto: CreateFileDto, files: Express.Multer.File[]) {
    const inscricao = await this.inscricaoService.findOne(+dto.inscricaoId);
    if (!inscricao) throw new Error("Inscrição não encontrada!");

    const { userDir, publicPathPrefix } = this.getUserDirInfo(inscricao.nomeCompleto, inscricao.cpf);
    const savedFiles: File[] = [];

    for (const file of files) {
      const fileName = file.originalname;
      const filePath = path.join(userDir, fileName);
      fs.writeFileSync(filePath, file.buffer);

      const newFile = this.filesRepository.create({
        fileName,
        path: `${publicPathPrefix}/${fileName}`,
        inscricao,
      });

      const savedFile = await this.filesRepository.save(newFile);
      savedFiles.push(savedFile);
    }

    return {
      message: "Arquivos salvos com sucesso!",
      files: savedFiles,
    };
  }

  async createUploadGraduacao(dto: CreateFileDto, files: Express.Multer.File[]) {
    return this.create(dto, files);
  }

  async createUploadDoutorado(dto: CreateFileDto, files: Express.Multer.File[]) {
    return this.create(dto, files);
  }

  async uploadCursoEducacao(dto: CreateFileDto, files: Express.Multer.File[]) {
    return this.create(dto, files);
  }

  async uploadMestrado(dto: CreateFileDto, files: Express.Multer.File[]) {
    return this.create(dto, files);
  }

  async uploadEspecializacao(dto: CreateFileDto, files: Express.Multer.File[]) {
    return this.create(dto, files);
  }

  async uploadExperienciasProfissionais(dto: CreateFileDto, files: Express.Multer.File[]) {
    return this.create(dto, files);
  }

  async updateFile(fileId: number, newFile: Express.Multer.File) {
    const fileEntity = await this.filesRepository.findOne({
      where: { id: fileId },
      relations: ['inscricao'],
    });

    if (!fileEntity) {
      throw new NotFoundException('Arquivo não encontrado');
    }

    const baseUploadsPath = path.join(__dirname, '../../uploads');
    const relativePath = fileEntity.path.replace(this.BASE_URL + '/', '');
    const oldFilePath = path.join(baseUploadsPath, relativePath);

    if (fs.existsSync(oldFilePath)) {
      fs.unlinkSync(oldFilePath);
    }

    fs.writeFileSync(oldFilePath, newFile.buffer);
    const updatedFile = await this.filesRepository.save(fileEntity);

    return {
      message: 'Arquivo atualizado com sucesso',
      file: updatedFile,
    };
  }

  async deleteFile(fileId: number) {
    const file = await this.filesRepository.findOne({
      where: { id: fileId },
      relations: ['inscricao'],
    });

    if (!file) {
      throw new NotFoundException('Arquivo não encontrado');
    }

    const baseUploadsPath = path.join(__dirname, '../../uploads');
    const relativePath = file.path.replace(this.BASE_URL + '/', '');
    const fullFilePath = path.join(baseUploadsPath, relativePath);

    if (fs.existsSync(fullFilePath)) {
      fs.unlinkSync(fullFilePath);
    }

    await this.filesRepository.delete(fileId);

    return { message: 'Arquivo removido com sucesso' };
  }
}
