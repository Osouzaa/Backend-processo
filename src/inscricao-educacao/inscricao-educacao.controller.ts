import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFiles, UseInterceptors } from '@nestjs/common';
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
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'ensinoFundamental', maxCount: 1 },
      { name: 'ensinoMedio', maxCount: 1 },
      { name: 'ensinoSuperior', maxCount: 1 },
      { name: 'cursoEducacao', maxCount: 1 },
      { name: 'doutorado', maxCount: 1 },
      { name: 'laudoPcd', maxCount: 1 },
    ])
  )
  create(
    @Body() createInscricaoEducacaoDto: CreateInscricaoEducacaoDto,
    @UploadedFiles()
    files: {
      ensinoFundamental?: Express.Multer.File[],
      ensinoMedio?: Express.Multer.File[],
      comprovanteEnsinoSuperior?: Express.Multer.File[],
      ensinoSuperior?: Express.Multer.File[],
      doutorado?: Express.Multer.File[],
      laudoPcd?: Express.Multer.File[],
    }
  ) {

    const allFiles: Express.Multer.File[] = Object.values(files)
      .flat()
      .filter(Boolean);

    return this.inscricaoEducacaoService.create(createInscricaoEducacaoDto, allFiles);
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
