import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFiles, UseInterceptors, Query, Res, UseGuards } from '@nestjs/common';
import { InscricaoEducacaoService } from './inscricao-educacao.service';
import { CreateInscricaoEducacaoDto } from './dto/create-inscricao-educacao.dto';
import { UpdateInscricaoEducacaoDto } from './dto/update-inscricao-educacao.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import type { QueryInscricaoEducacaoDto } from './dto/query-inscricao-educacao.dto';
import { Response } from 'express'
import * as fs from 'fs';
import * as path from 'path';
import * as archiver from 'archiver';
import { AuthGuard } from 'src/auth/auth.guard';
import { CurrentUser } from 'src/decorators/currentUser.decorator';
import { AuthGuardCandidates } from 'src/candidates/auth.guard';

@Controller('inscricao-educacao')
export class InscricaoEducacaoController {
  constructor(private readonly inscricaoEducacaoService: InscricaoEducacaoService) { }


  @UseGuards(AuthGuard, AuthGuardCandidates)
  @Post()
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'cpfFile', maxCount: 1 },
    { name: 'comprovanteEndereco', maxCount: 1 },
    { name: 'comprovanteReservista', maxCount: 1 },
    { name: 'laudoPcd', maxCount: 1 },
  ]))
  create(
    @CurrentUser() user: CurrentUser,
    @Body() createInscricaoEducacaoDto: CreateInscricaoEducacaoDto,
    @UploadedFiles() files: {
      cpfFile?: Express.Multer.File[],
      comprovanteEndereco?: Express.Multer.File[],
      comprovanteReservista?: Express.Multer.File[],
      laudoPcd?: Express.Multer.File[]
    }
  ) {
    return this.inscricaoEducacaoService.create(createInscricaoEducacaoDto, files, user);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll(@Query() query: QueryInscricaoEducacaoDto & { page?: number }) {
    return this.inscricaoEducacaoService.findAll(query);
  }

  @UseGuards(AuthGuard)
  @Get('export')
  async exportToExel(@Res() res: Response) {
    const buffer = await this.inscricaoEducacaoService.exportToExcel();

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=inscricao_educacao.xlsx');

    return res.send(buffer);
  }

  @Get('download/:id')
  async downloadFolder(
    @Param('id') id: string,
    @Res() res: Response
  ) {
    // Sanitiza o CPF para garantir o padrão


    // Procura o candidato pelo CPF
    const inscricao = await this.inscricaoEducacaoService.findOne(+id);

    const cpfSanitizado = inscricao.cpf.replace(/\D/g, '');

    if (!inscricao) {
      return res.status(404).json({ message: 'Inscrição não encontrada' });
    }

    // Sanitiza o nome e cria o nome da pasta
    const nomeSanitizado = inscricao.nomeCompleto.normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "_")
      .replace(/[^\w\s]/gi, "");

    const folderName = `${nomeSanitizado}_${cpfSanitizado}`;
    const folderPath = path.join(__dirname, '../../uploads', folderName);

    if (!fs.existsSync(folderPath)) {
      return res.status(404).json({ message: 'Pasta não encontrada no servidor' });
    }

    const zipName = `${folderName}.zip`;
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename=${zipName}`);

    const archive = archiver('zip', { zlib: { level: 9 } });
    archive.directory(folderPath, false);
    archive.finalize();

    archive.pipe(res);
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
