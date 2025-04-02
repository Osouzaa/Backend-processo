import { Injectable } from '@nestjs/common';
import { CreateInscricaoEducacaoDto } from './dto/create-inscricao-educacao.dto';
import { UpdateInscricaoEducacaoDto } from './dto/update-inscricao-educacao.dto';

@Injectable()
export class InscricaoEducacaoService {
  create(createInscricaoEducacaoDto: CreateInscricaoEducacaoDto) {
    return 'This action adds a new inscricaoEducacao';
  }

  findAll() {
    return `This action returns all inscricaoEducacao`;
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
