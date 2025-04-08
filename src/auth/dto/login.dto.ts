import { IsNotEmpty, IsString } from "class-validator";

export class LoginDto {

  @IsString()
  @IsNotEmpty()
  @IsNotEmpty()
  email: string;


  @IsString()
  @IsNotEmpty()
  password: string
}