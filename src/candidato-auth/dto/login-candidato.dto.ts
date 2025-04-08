import { IsEmail, IsString } from 'class-validator';

export class LoginCandidatoDto {
  @IsString()
  cpf: string;

  @IsString()
  senha: string;
}
