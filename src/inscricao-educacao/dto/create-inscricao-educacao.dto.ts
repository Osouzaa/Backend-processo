import { Transform } from 'class-transformer';
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

  // @IsString()
  // @IsNotEmpty()
  // cpfLink: string;

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

  @IsOptional()
  @IsString()
  contatoTelefoneFixo: string;

  @IsNotEmpty()
  @IsString()
  contatoCelular: string;

  @IsString()
  pcd: string;

  @IsOptional()
  @IsString()
  laudoPcd?: string;

  @IsOptional()
  @IsString()
  vagaDestinadaAPCD?: string;

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


  // @IsString()
  // @IsNotEmpty()
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

  // 📊 Convertendo número corretamente
  @Transform(({ value }) => Number(value))
  @IsOptional()
  @IsNumber()
  tempoExperiencia?: number;
}
