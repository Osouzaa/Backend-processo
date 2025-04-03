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

  async create(fileName: string) {
    const tempfile = this.filesRepository.create({ fileName });

    const file = await this.filesRepository.save(tempfile);

    return file;
  }
}
