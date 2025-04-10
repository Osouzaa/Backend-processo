import { Body, Controller, Post, UploadedFile, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { CreateFileDto } from "./dto/create.file.dto";
import { FilesService } from "./files.service";

@Controller('files')
export class FilesController {
  constructor(private readonly fileService: FilesService) { }

  @Post('ensino-medio')
  @UseInterceptors(FilesInterceptor('files', 2))
  uploadEnsinoMedio(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() createFileDTO: CreateFileDto
  ) {
    return this.fileService.create(createFileDTO, files);
  }


  @Post('graduacao')
  @UseInterceptors(FilesInterceptor('files', 2))
  uploadGraduacao(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() createFileDTO: CreateFileDto
  ) {
    return this.fileService.createUploadGraduacao(createFileDTO, files);
  }

  @Post('upload-doutorado')
  @UseInterceptors(FilesInterceptor('files', 2))
  uploadDoutorado(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() createFileDTO: CreateFileDto
  ) {
    return this.fileService.createUploadDoutorado(createFileDTO, files);
  }

  @Post('cursoEducacao')
  @UseInterceptors(FilesInterceptor('files', 2))
  uploadCursoEducacao(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() createFileDTO: CreateFileDto
  ) {
    return this.fileService.uploadCursoEducacao(createFileDTO, files);
  }

  @Post('upload-mestrado')
  @UseInterceptors(FilesInterceptor('files', 2))
  uploadMestrado(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() createFileDTO: CreateFileDto
  ) {
    return this.fileService.uploadMestrado(createFileDTO, files);
  }

  @Post('upload-especializacao')
  @UseInterceptors(FilesInterceptor('files', 2))
  uploadEspecializacao(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() createFileDTO: CreateFileDto
  ) {
    return this.fileService.uploadEspecializacao(createFileDTO, files);
  }

  @Post('upload-experiencias')
  @UseInterceptors(FilesInterceptor('files')) // sem limite de arquivos
  uploadExperiencias(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() createFileDTO: CreateFileDto
  ) {
    return this.fileService.uploadExperienciasProfissionais(createFileDTO, files);
  }



}
