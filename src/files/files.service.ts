import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { File } from 'src/db/entities/file.entity';
import * as fs from "fs";
import * as path from "path";
import { CreateFileDto } from "./dto/create.file.dto";
import { InscricaoEducacaoService } from 'src/inscricao-educacao/inscricao-educacao.service';

@Injectable()
export class FilesService {
  private readonly logger = new Logger(FilesService.name);

  constructor(
    @InjectRepository(File)
    private filesRepository: Repository<File>,
    private inscricaoService: InscricaoEducacaoService
  ) { }

  async create(dto: CreateFileDto, file: Express.Multer.File) {

    const inscricao = await this.inscricaoService.findOne(+dto.inscricaoId);

    if (!inscricao) {
      throw new Error("Inscrição não encontrada!");
    }

    function sanitize(str: string): string {
      return str.normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, "_")
        .replace(/[^\w\s]/gi, "");
    }

    const nomeSanitizado = sanitize(inscricao.nomeCompleto);
    const cpfSanitizado = inscricao.cpf.replace(/\D/g, "");

    const userDir = path.join(__dirname, '../../uploads', `${nomeSanitizado}_${cpfSanitizado}`);

    if (!fs.existsSync(userDir)) {
      fs.mkdirSync(userDir, { recursive: true });
    }

    const filePath = path.join(userDir, 'comprovante_ensino_medio.pdf');

    fs.writeFileSync(filePath, file.buffer);

    const newFile = this.filesRepository.create({
      fileName: "comprovante_ensino_medio.pdf",
      path: filePath,
      inscricao: inscricao,
    });

    await this.filesRepository.save(newFile);

    return { message: "Arquivo salvo com sucesso!", file: newFile };
  }

  async createUploadGraduacao(dto: CreateFileDto, file: Express.Multer.File) {

    const inscricao = await this.inscricaoService.findOne(+dto.inscricaoId);

    if (!inscricao) {
      throw new Error("Inscrição não encontrada!");
    }

    function sanitize(str: string): string {
      return str.normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, "_")
        .replace(/[^\w\s]/gi, "");
    }

    const nomeSanitizado = sanitize(inscricao.nomeCompleto);
    const cpfSanitizado = inscricao.cpf.replace(/\D/g, "");

    const userDir = path.join(__dirname, '../../uploads', `${nomeSanitizado}_${cpfSanitizado}`);

    if (!fs.existsSync(userDir)) {
      fs.mkdirSync(userDir, { recursive: true });
    }

    const filePath = path.join(userDir, 'Comprovante Graduação.pdf');

    fs.writeFileSync(filePath, file.buffer);

    const newFile = this.filesRepository.create({
      fileName: "comprovante_ensino_medio.pdf",
      path: filePath,
      inscricao: inscricao,
    });

    await this.filesRepository.save(newFile);

    return { message: "Arquivo salvo com sucesso!", file: newFile };
  }
}
