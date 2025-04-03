import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFiles, UseInterceptors, UploadedFile, ParseFilePipeBuilder, HttpStatus } from '@nestjs/common';
import { InscricaoEducacaoService } from './inscricao-educacao.service';
import { CreateInscricaoEducacaoDto } from './dto/create-inscricao-educacao.dto';
import { UpdateInscricaoEducacaoDto } from './dto/update-inscricao-educacao.dto';
import { FileFieldsInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('inscricao-educacao')
export class InscricaoEducacaoController {
  constructor(private readonly inscricaoEducacaoService: InscricaoEducacaoService) { }


  @Post()
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'cpfFile', maxCount: 1 },
    { name: 'comprovanteEndereco', maxCount: 1 },
  ]))
  create(
    @Body() createInscricaoEducacaoDto: CreateInscricaoEducacaoDto,
    @UploadedFiles() files: { cpfFile?: Express.Multer.File[], comprovanteEndereco?: Express.Multer.File[] }

  ) {
    return this.inscricaoEducacaoService.create(createInscricaoEducacaoDto, files);
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
