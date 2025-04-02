import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { InscricaoEducacaoService } from './inscricao-educacao.service';
import { CreateInscricaoEducacaoDto } from './dto/create-inscricao-educacao.dto';
import { UpdateInscricaoEducacaoDto } from './dto/update-inscricao-educacao.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('inscricao-educacao')
export class InscricaoEducacaoController {
  constructor(private readonly inscricaoEducacaoService: InscricaoEducacaoService) { }

  @Post()
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          callback(null, file.fieldname + '-' + uniqueSuffix + extname(file.originalname));
        },
      }),
    }),
  )
  create(
    @Body() createInscricaoEducacaoDto: CreateInscricaoEducacaoDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    console.log("Files", files)
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
