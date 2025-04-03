import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { File } from 'src/db/entities/file.entity';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(File)
    private filesRepository: Repository<File>,
  ) { }

  async saveFile(filename: string, path: string, inscricao: any) {
    const file = this.filesRepository.create({ filename, path, inscricao });
    return await this.filesRepository.save(file);
  }
}
