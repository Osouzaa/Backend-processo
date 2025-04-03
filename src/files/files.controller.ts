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
    console.log(file, createFileDTO);
    return this.fileService.create(createFileDTO, file);
  }

  @Post('graduacao')
  @UseInterceptors(FilesInterceptor('graduacao', 10)) // Permite até 10 arquivos
  uploadGraduacao(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() createFileDTO: CreateFileDto
  ) {
    console.log(files, createFileDTO);
    return this.fileService.createUploadGraduacao(createFileDTO, files);
  }

}
