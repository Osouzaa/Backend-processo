import { Controller, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { CreateFileDto } from "./dto/create.file.dto";
import { FilesService } from "./files.service";

@Controller('files')
export class InscricaoEducacaoController {
  constructor(private readonly fileService: FilesService) { }

  @Post('ensino-medio')
  @UseInterceptors(FileInterceptor('ensinoMedioFile')) // Aceita apenas um arquivo
  uploadEnsinoMedio(
    @UploadedFile() file: Express.Multer.File,
    createFileDTO: CreateFileDto
  ) {
    return this.fileService.create(createFileDTO, file);
  }
}
