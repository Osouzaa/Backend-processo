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

  // Endereço

  @IsString()
  cep: string;

  @IsString()
  @IsNotEmpty()
  logradouro: string;

  @IsString()
  @IsOptional()
  complemento: string;

  @IsString()
  @IsNotEmpty()
  numero: string;

  @IsString()
  @IsNotEmpty()
  bairro: string;

  @IsString()
  @IsNotEmpty()
  cidade: string;

  @IsString()
  @IsNotEmpty()
  estado: string;


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
