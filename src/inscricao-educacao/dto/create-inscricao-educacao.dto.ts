import { IsNotEmpty, IsOptional, IsBoolean, IsString, IsDate } from 'class-validator';

export class CreateInscricaoEducacaoDto {
  @IsNotEmpty()
  @IsString()
  nomeCompleto: string;

  @IsNotEmpty()
  @IsDate()
  dataNascimento: Date;

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

  @IsBoolean()
  pcd: boolean;

  @IsOptional()
  @IsString()
  laudoPcd?: string;

  @IsNotEmpty()
  @IsString()
  cargoFuncao: string;

  // 📚 Escolaridade
  @IsOptional()
  @IsString()
  ensinoFundamental?: string;

  @IsOptional()
  @IsString()
  ensinoMedio?: string;

  @IsOptional()
  @IsString()
  ensinoSuperior?: string;

  @IsOptional()
  @IsString()
  cursoEducacao?: string;

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
