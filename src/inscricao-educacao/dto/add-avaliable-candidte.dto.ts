import { IsOptional, IsString } from "class-validator";

export class AddAvaliableCandidateDto {
  @IsString()
  status: string

  @IsOptional()
  @IsString()
  obs: string;
}