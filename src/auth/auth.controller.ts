import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import type { LoginDto } from './dto/login.dto';
import type { RegisterUserDTO } from './dto/register.dto';

interface AuthResponse {
  access_token: string;
}

interface UserProfile {
  id: string;
  email: string;
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() loginDto: LoginDto): Promise<AuthResponse> {
    return this.authService.signIn(loginDto);
  }

  @Post('register')
  signUp(@Body() registerUserDto: RegisterUserDTO) {
    return this.authService.register(registerUserDto);
  }
}
