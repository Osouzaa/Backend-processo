import { IsEmail, IsString } from 'class-validator';

export class LoginCandidatoDto {
  @IsEmail()
  email: string;

  @IsString()
  senha: string;
}
