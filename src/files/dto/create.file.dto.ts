import { IsString } from "class-validator";

export class CreateFileDto {
  @IsString()
  fileName: string;

  @IsString()
  path: string

  @IsString()
  inscricaoId: string
}