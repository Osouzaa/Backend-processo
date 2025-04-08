import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UserService } from 'src/user/user.service';
import type { LoginDto } from './dto/login.dto';
import type { RegisterUserDTO } from './dto/register.dto';

interface AuthResponse {
  access_token: string;
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService
  ) { }

  async signIn(loginDto: LoginDto): Promise<AuthResponse> {
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException();
    }

    const passwordMatch = await bcrypt.compare(loginDto.password, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedException();
    }

    const payload = { sub: user.id, email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(registerUserDto: RegisterUserDTO): Promise<{ message: string }> {
    const existingUser = await this.usersService.findByEmail(registerUserDto.email);
    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(registerUserDto.password, 6);

    await this.usersService.create({
      ...registerUserDto,
      password: hashedPassword,
    });

    return { message: 'User registered successfully' };
  }
}
