import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Put,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { CreateFileDto } from './dto/create.file.dto';
import { FilesService } from './files.service';

@Controller('files')
export class FilesController {
  constructor(private readonly fileService: FilesService) { }

  @Post('ensino-medio')
  @UseInterceptors(FileInterceptor('file'))
  uploadEnsinoMedio(
    @UploadedFile() file: Express.Multer.File,
    @Body() createFileDTO: CreateFileDto,
  ) {
    return this.fileService.create(createFileDTO, [file]);
  }

  @Post('graduacao')
  @UseInterceptors(FileInterceptor('file'))
  uploadGraduacao(
    @UploadedFile() file: Express.Multer.File,
    @Body() createFileDTO: CreateFileDto,
  ) {
    return this.fileService.createUploadGraduacao(createFileDTO, [file]);
  }

  @Post('upload-doutorado')
  @UseInterceptors(FileInterceptor('file'))
  uploadDoutorado(
    @UploadedFile() file: Express.Multer.File,
    @Body() createFileDTO: CreateFileDto,
  ) {
    return this.fileService.createUploadDoutorado(createFileDTO, [file]);
  }

  @Post('cursoEducacao')
  @UseInterceptors(FileInterceptor('file'))
  uploadCursoEducacao(
    @UploadedFile() file: Express.Multer.File,
    @Body() createFileDTO: CreateFileDto,
  ) {
    return this.fileService.uploadCursoEducacao(createFileDTO, [file]);
  }

  @Post('upload-mestrado')
  @UseInterceptors(FileInterceptor('file'))
  uploadMestrado(
    @UploadedFile() file: Express.Multer.File,
    @Body() createFileDTO: CreateFileDto,
  ) {
    return this.fileService.uploadMestrado(createFileDTO, [file]);
  }

  @Post('upload-especializacao')
  @UseInterceptors(FilesInterceptor('files'))
  uploadEspecializacao(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() createFileDTO: CreateFileDto,
  ) {
    return this.fileService.uploadEspecializacao(createFileDTO, files);
  }

  @Post('upload-experiencias')
  @UseInterceptors(FilesInterceptor('files')) // nome do campo no form deve ser 'files'
  uploadExperiencias(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() createFileDTO: CreateFileDto,
  ) {
    return this.fileService.uploadExperienciasProfissionais(createFileDTO, files);
  }

  @Post('upload-experiencias-oneFile')
  @UseInterceptors(FileInterceptor('file'))
  uploadExperienciasOneFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() createFileDTO: CreateFileDto,
  ) {
    return this.fileService.uploadExperienciasProfissionais(createFileDTO, [file]);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('file'))
  async updateFile(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.fileService.updateFile(+id, file);
  }

  @Delete(':id')
  async deleteFile(@Param('id') id: string) {
    return this.fileService.deleteFile(+id);
  }
}
