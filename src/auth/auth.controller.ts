import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterUserDTO } from './dto/register.dto';

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
