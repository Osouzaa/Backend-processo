import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CandidatoAuthService } from './candidato-auth.service';
import { LoginCandidatoDto } from './dto/login-candidato.dto';
import { RegisterCandidatoDTO } from './dto/register-candidato.dto';

@Controller('auth/candidato')
export class CandidatoAuthController {
  constructor(private readonly authService: CandidatoAuthService) { }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() loginDto: LoginCandidatoDto) {
    return this.authService.login(loginDto);
  }

  @Post('register')
  async register(@Body() registerDto: RegisterCandidatoDTO) {
    return this.authService.register(registerDto);
  }
}
