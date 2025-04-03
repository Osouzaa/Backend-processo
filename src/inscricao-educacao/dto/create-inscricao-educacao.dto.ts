import { IsNotEmpty, IsOptional, IsBoolean, IsString, IsNumber } from 'class-validator';

export class CreateInscricaoEducacaoDto {
  @IsNotEmpty()
  @IsString()
  nomeCompleto: string;

  @IsNotEmpty()
  @IsString()
  dataNascimento: string;

  @IsOptional()
  @IsString()
  rg: string;

  @IsNotEmpty()
  @IsString()
  cpf: string;

  @IsNotEmpty()
  @IsString()
  genero: string;

  @IsOptional()
  @IsString()
  certificadoReservista?: string;

  @IsNotEmpty()
  @IsString()
  nacionalidade: string;

  @IsNotEmpty()
  @IsString()
  naturalidade: string;

  @IsNotEmpty()
  @IsString()
  estadoCivil: string;

  @IsNotEmpty()
  @IsString()
  contato: string;

  @IsString()
  pcd: string;

  @IsOptional()
  @IsString()
  laudoPcd?: string;

  @IsNotEmpty()
  @IsString()
  cargoFuncao: string;

  // 📚 Escolaridade
  @IsBoolean()
  possuiEnsinoFundamental: boolean;

  @IsBoolean()
  possuiEnsinoMedio: boolean;

  @IsBoolean()
  possuiEnsinoSuperior: boolean;

  @IsBoolean()
  possuiCursoAreaEducacao: boolean;

  @IsBoolean()
  possuiDoutorado: boolean;

  @IsOptional()
  @IsNumber()
  tempoExperiencia?: number;
}
