import { Controller, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { CreateFileDto } from "./dto/create.file.dto";
import { FilesService } from "./files.service";

@Controller('files')
export class FilesController {
  constructor(private readonly fileService: FilesService) { }

  @Post('ensino-medio')
  @UseInterceptors(FileInterceptor('ensinoMedioFile'))
  uploadEnsinoMedio(
    @UploadedFile() file: Express.Multer.File,
    createFileDTO: CreateFileDto
  ) {
    return this.fileService.create(createFileDTO, file);
  }
}
