import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { File } from 'src/db/entities/file.entity';
import * as fs from "fs";
import * as path from "path";
import { CreateFileDto } from "./dto/create.file.dto";
import { InscricaoEducacaoService } from 'src/inscricao-educacao/inscricao-educacao.service';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(File)
    private filesRepository: Repository<File>,
    private inscricaoService: InscricaoEducacaoService
  ) { }

  async create(dto: CreateFileDto, file: Express.Multer.File) {

    const inscricao = await this.inscricaoService.findOne(+dto.inscricaoId);

    const userDir = path.join(__dirname, '../../uploads', inscricao.nomeCompleto.replace(/\s+/g, '_'));

    if (!fs.existsSync(userDir)) {
      fs.mkdirSync(userDir, { recursive: true });
    }

    const filePath = path.join(userDir, 'comprovante_ensino_medio.pdf'); // Nome fixo
    fs.writeFileSync(filePath, file.buffer);

    return { message: "Arquivo salvo com sucesso!", path: filePath };
  }
}
