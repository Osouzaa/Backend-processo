import { Body, Controller, Post, UploadedFile, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { CreateFileDto } from "./dto/create.file.dto";
import { FilesService } from "./files.service";

@Controller('files')
export class FilesController {
  constructor(private readonly fileService: FilesService) { }

  @Post('ensino-medio')
  @UseInterceptors(FileInterceptor('ensinoMedioFile'))
  uploadEnsinoMedio(
    @UploadedFile() file: Express.Multer.File,
    @Body() createFileDTO: CreateFileDto
  ) {
    return this.fileService.create(createFileDTO, file);
  }

  @Post('graduacao')
  @UseInterceptors(FilesInterceptor('graduacao', 5))
  uploadGraduacao(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() createFileDTO: CreateFileDto
  ) {
    return this.fileService.createUploadGraduacao(createFileDTO, files);
  }

  @Post('upload-doutorado')
  @UseInterceptors(FileInterceptor('file'))
  uploadDoutorado(
    @UploadedFile() file: Express.Multer.File,
    @Body() createFileDTO: CreateFileDto
  ) {
    return this.fileService.createUploadDoutorado(createFileDTO, file);
  }

  @Post('cursoEducacao')
  @UseInterceptors(FileInterceptor('cursoEducacao'))
  uploadCursoEducacao(
    @UploadedFile() file: Express.Multer.File,
    @Body() createFileDTO: CreateFileDto
  ) {
    return this.fileService.uploadCursoEducacao(createFileDTO, file);
  }



}
