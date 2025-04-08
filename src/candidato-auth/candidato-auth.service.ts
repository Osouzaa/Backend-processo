import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { Candidato } from 'src/db/entities/candidato.entity';
import type { RegisterCandidatoDTO } from './dto/register-candidato.dto';
import type { LoginCandidatoDto } from './dto/login-candidato.dto';

@Injectable()
export class CandidatoAuthService {
  constructor(
    @InjectRepository(Candidato)
    private readonly candidatoRepo: Repository<Candidato>,
    private readonly jwtService: JwtService,
  ) { }

  async register(dto: RegisterCandidatoDTO) {
    const existing = await this.candidatoRepo.findOne({ where: { email: dto.email } });

    if (existing) {
      throw new ConflictException('E-mail já cadastrado.');
    }

    const senhaCriptografada = await bcrypt.hash(dto.senha, 10);

    const novoCandidato = this.candidatoRepo.create({
      ...dto,
      senha: senhaCriptografada,
    });

    await this.candidatoRepo.save(novoCandidato);

    return { message: 'Candidato registrado com sucesso!' };
  }

  async login(dto: LoginCandidatoDto) {
    const candidato = await this.candidatoRepo.findOne({ where: { email: dto.email } });

    if (!candidato || !(await bcrypt.compare(dto.senha, candidato.senha))) {
      throw new UnauthorizedException('Credenciais inválidas.');
    }

    const payload = {
      sub: candidato.id,
      email: candidato.email,
      role: 'candidato',
    };

    const access_token = await this.jwtService.signAsync(payload);

    return {
      access_token,
    };
  }
}
