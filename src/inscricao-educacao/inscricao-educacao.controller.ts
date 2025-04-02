import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { InscricaoEducacaoService } from './inscricao-educacao.service';
import { CreateInscricaoEducacaoDto } from './dto/create-inscricao-educacao.dto';
import { UpdateInscricaoEducacaoDto } from './dto/update-inscricao-educacao.dto';

@Controller('inscricao-educacao')
export class InscricaoEducacaoController {
  constructor(private readonly inscricaoEducacaoService: InscricaoEducacaoService) {}

  @Post()
  create(@Body() createInscricaoEducacaoDto: CreateInscricaoEducacaoDto) {
    return this.inscricaoEducacaoService.create(createInscricaoEducacaoDto);
  }

  @Get()
  findAll() {
    return this.inscricaoEducacaoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.inscricaoEducacaoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateInscricaoEducacaoDto: UpdateInscricaoEducacaoDto) {
    return this.inscricaoEducacaoService.update(+id, updateInscricaoEducacaoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.inscricaoEducacaoService.remove(+id);
  }
}
