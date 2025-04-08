import { IsEmail, IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export class CreateCandidateDto {
  @IsNotEmpty()
  @IsString()
  nome: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  cpf: string;

  @IsNotEmpty()
  celular: string;

  @IsNotEmpty()
  senha_hash: string;
}
