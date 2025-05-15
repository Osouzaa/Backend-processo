import { IsOptional, IsString } from "class-validator";

export class QueryInscricaoEducacaoDto {

  @IsOptional()
  @IsString()
  nomeCompleto: string;

  @IsOptional()
  @IsString()
  cpf: string;

  @IsOptional()
  @IsString()
  escolaridade: string;

  @IsOptional()
  @IsString()
  cargoFuncao: string;


  @IsOptional()
  @IsString()
  cotaRacial: string;

    @IsOptional()
  @IsString()
  pcd: string;




}