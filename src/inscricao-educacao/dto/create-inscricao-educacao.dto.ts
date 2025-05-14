import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsBoolean, IsString, IsNumber } from 'class-validator';

export class CreateInscricaoEducacaoDto {
  @IsNotEmpty()
  @IsString()
  nomeCompleto: string;

  @IsNotEmpty()
  @IsString()
  dataNascimento: string;

  @IsNotEmpty()
  @IsString()
  escolaridade: string

  @IsOptional()
  @IsString()
  rg: string;

  @IsNotEmpty()
  @IsString()
  cpf: string;

  // @IsString()
  // @IsOptional()
  // cpfLink: string;

  @IsNotEmpty()
  @IsString()
  genero: string;

  @IsNotEmpty()
  @IsString()
  email: string;

  @IsOptional()
  @IsString()
  certificadoReservista?: string;

  @IsNotEmpty()
  @IsString()
  nacionalidade: string;

  @IsOptional()
  @IsString()
  naturalidade: string;

  @IsOptional()
  @IsString() 
  cidadeNaturalidade: string;

  @IsOptional()
  @IsString()
  naturalEstragerio: string

  @IsNotEmpty()
  @IsString()
  estadoCivil: string;

  @IsOptional()
  @IsString()
  contatoTelefoneFixo: string;

  @IsNotEmpty()
  @IsString()
  contatoCelular: string;

  @IsOptional()
  @IsString()
  pcd: string;

  @IsOptional()
  @IsString()
  vagaDestinadaAPCD?: string;

  @IsNotEmpty()
  @IsString()
  cargoFuncao: string;

  @IsNotEmpty()
  @IsBoolean()
  cotaRacial: boolean;

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


  // @IsString()
  // @IsOptional()
  // comprovanteEnderecoLink: string;


  // 📚 Escolaridade
  @IsString()
  possuiEnsinoFundamental: string;

  @IsString()
  possuiEnsinoMedio: string;

  @IsString()
  possuiEnsinoSuperior: string;

  @IsString()
  @IsOptional()
  quantidadeEnsinoSuperior: string;

  @IsString()
  possuiCursoAreaEducacao: string;

  @IsString()
  @IsOptional()
  quantidadeCursoAreaEducacao: string;

  @IsString()
  possuiDoutorado: string;

  @IsString()
  @IsOptional()
  quantidadeDoutorado: string;

  @IsString()
  @IsOptional()
  possuiMestrado: string;

  @IsString()
  @IsOptional()
  quantidadeMestrado: string;

  @IsString()
  @IsOptional()
  possuiEspecializacao: string;

  @IsString()
  @IsOptional()
  quantidadeEspecilizacao: string;

  // 📊 Convertendo número corretamente
  @Transform(({ value }) => Number(value))
  @IsOptional()
  @IsNumber()
  tempoExperiencia?: number;

  @Transform(({ value }) => Number(value))
  @IsOptional()
  @IsNumber()
  totalDeDias?: number;
}
