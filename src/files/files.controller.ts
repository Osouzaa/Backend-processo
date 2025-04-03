import { Controller } from "@nestjs/common";
import type { File } from "src/db/entities/file.entity";

@Controller('files')
export class InscricaoEducacaoController {
  constructor(private readonly filesRepository: File) { }
}