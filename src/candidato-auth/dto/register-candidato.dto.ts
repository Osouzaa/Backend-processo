import { IsEmail, IsString } from 'class-validator';

export class RegisterCandidatoDTO {
  @IsString()
  nome: string;

  @IsEmail()
  email: string;

  @IsString()
  senha: string;

  @IsString()
  celular: string;

  @IsString()
  cpf: string;
}
