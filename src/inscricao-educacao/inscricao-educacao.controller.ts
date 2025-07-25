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
import { AuthGuardCandidates } from 'src/candidato-auth/auth.guard';
import type { UpdateScoreDto } from './dto/update-score.dto';
import type { AddAvaliableCandidateDto } from './dto/add-avaliable-candidte.dto';

@Controller('inscricao-educacao')
export class InscricaoEducacaoController {
  constructor(private readonly inscricaoEducacaoService: InscricaoEducacaoService) { }


  @UseGuards(AuthGuard, AuthGuardCandidates)
  @Post()
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'cpfLink', maxCount: 1 },
    { name: 'comprovanteEnderecoLink', maxCount: 1 },
    { name: 'certificadoReservistaLink', maxCount: 1 },
    { name: 'laudoPcd', maxCount: 1 },
    { name: 'cotaRacialLink', maxCount: 1 },
  ]))
  create(
    @CurrentUser() user: CurrentUser,
    @Body() createInscricaoEducacaoDto: CreateInscricaoEducacaoDto,
    @UploadedFiles() files: {
      cpfLink?: Express.Multer.File[],
      comprovanteEnderecoLink?: Express.Multer.File[],
      certificadoReservistaLink?: Express.Multer.File[],
      laudoPcd?: Express.Multer.File[]
      cotaRacialLink?: Express.Multer.File[]
    }
  ) {
    return this.inscricaoEducacaoService.create(createInscricaoEducacaoDto, files, user);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll(@Query() query: QueryInscricaoEducacaoDto & { page?: number }) {
    return this.inscricaoEducacaoService.findAll(query);
  }
  @Post(':id/status')
  addCandidateStatus(
    @Param('id') id: number,
    @Body() addAvaliableCandidateDto: AddAvaliableCandidateDto,
  ) {
    return this.inscricaoEducacaoService.addStatus(id, addAvaliableCandidateDto);
  }



  @UseGuards(AuthGuard)
  @Get('exportar') // Mudamos para 'exportar' e método GET para clareza
  async exportarExcel(
    @Query() query: QueryInscricaoEducacaoDto, // Recebe os filtros da URL
    @Res() res: Response,
  ) {
    // 1. Opcional, mas recomendado: remove a paginação dos filtros para garantir que TUDO seja exportado
    const queryCompleta: any = { ...query };
    delete queryCompleta.page;
    delete queryCompleta.limit;

    // 2. O backend busca os dados usando os filtros.
    //    Nossa função 'findAll' já está preparada para retornar a lista completa quando há 'cargoFuncao'.
    const resultado = await this.inscricaoEducacaoService.findAll(queryCompleta);

    // 3. Gera o Excel com a lista completa que o próprio backend buscou
    const buffer = await this.inscricaoEducacaoService.exportArrayToExcel(
      resultado.data, // Usa a lista completa do resultado
    );

    // 4. Envia o arquivo como resposta
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=inscricao_educacao.xlsx');
    res.send(buffer);
  }

  @Get('download/:id')
  async downloadFolder(
    @Param('id') id: string,
    @Res() res: Response
  ) {
    const inscricao = await this.inscricaoEducacaoService.findOne(+id);

    const cpfSanitizado = inscricao.cpf.replace(/\D/g, '');

    if (!inscricao) {
      return res.status(404).json({ message: 'Inscrição não encontrada' });
    }
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

  @Patch('updatedScore/:id')
  updateScore(@Param('id') id: string,
    @Body() body: UpdateScoreDto
  ) {
    return this.inscricaoEducacaoService.updateScore(+id, body);
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
