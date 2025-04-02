import { IsNotEmpty, IsOptional, IsBoolean, IsString } from 'class-validator';

export class CreateInscricaoEducacaoDto {
  @IsNotEmpty()
  @IsString()
  nomeCompleto: string;

  @IsNotEmpty()
  @IsString()
  dataNascimento: string;

  @IsNotEmpty()
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
  @IsOptional()
  possuiEnsinoFundamental: boolean;

  @IsOptional()
  @IsString()
  ensinoFundamental?: string;

  @IsBoolean()
  @IsOptional()
  possuiEnsinoMedio: boolean;

  @IsOptional()
  @IsString()
  ensinoMedio?: string;

  @IsBoolean()
  @IsOptional()
  possuiEnsinoSuperior: boolean;

  @IsOptional()
  @IsString()
  ensinoSuperior?: string;


  @IsBoolean()
  @IsOptional()
  possuiCursoAreaEducacao: boolean;

  @IsOptional()
  @IsString()
  cursoAreaEducacao?: string;


  @IsBoolean()
  @IsOptional()
  possuiDoutorado: boolean;

  @IsOptional()
  @IsString()
  doutorado?: string;

  // 🏢 Experiência Profissional
  @IsOptional()
  @IsString()
  experienciaMunicipal?: string;

  @IsOptional()
  @IsString()
  experienciaEstadual?: string;
}
