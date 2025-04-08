import { IsEmail, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Length(1, 255)
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @Length(1, 255)
  matricula: string;

  @IsString()
  @Length(6, 255)
  password: string;
}