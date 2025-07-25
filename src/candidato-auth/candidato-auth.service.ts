import { Injectable, UnauthorizedException, ConflictException, NotFoundException, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { Candidato } from 'src/db/entities/candidato.entity';
import type { RegisterCandidatoDTO } from './dto/register-candidato.dto';
import type { LoginCandidatoDto } from './dto/login-candidato.dto';
import { MailerService } from 'src/mail/mail.service';

@Injectable()
export class CandidatoAuthService {
  constructor(
    @InjectRepository(Candidato)
    private readonly candidatoRepo: Repository<Candidato>,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
  ) { }

  async register(dto: RegisterCandidatoDTO) {
    const existing = await this.candidatoRepo.findOne({ where: { cpf: dto.cpf } });

    if (existing) {
      throw new ConflictException('Candidato já cadastrado!');
    }

    if (await this.candidatoRepo.findOne({ where: { email: dto.email } })) {
      throw new ConflictException('Email already in use');
    }

    const senhaCriptografada = await bcrypt.hash(dto.senha, 8);
    const codigoVerificacao = Math.floor(100000 + Math.random() * 900000).toString();

    const novoCandidato = this.candidatoRepo.create({
      ...dto,
      senha_hash: senhaCriptografada,
      codigoVerificacao,
      verificado: false,
    });

    await this.candidatoRepo.save(novoCandidato);

    await this.mailerService.enviarCodigoVerificacao(dto.email, codigoVerificacao, dto.cpf);

    return { message: 'Candidato registrado com sucesso! Verifique seu e-mail.' };
  }

  async verificarCodigo(cpf: string, codigo: string) {
    const candidato = await this.candidatoRepo.findOne({ where: { cpf } });

    if (!candidato) {
      throw new NotFoundException('Candidato nao encontrado');
    }

    if (candidato.verificado) {
      throw new ConflictException('Este candidato já foi verificado. Faça login normalmente.');
    }
    if (candidato.codigoVerificacao !== codigo) {
      throw new UnauthorizedException('Código de verificação inválido. Verifique sua caixa de entrada ou spam.');
    }

    candidato.verificado = true;
    candidato.codigoVerificacao = null;
    await this.candidatoRepo.save(candidato);

    return { message: 'Candidato verificado com sucesso!' };



  }

  async login(dto: LoginCandidatoDto) {
    const candidato = await this.candidatoRepo.findOne({ where: { cpf: dto.cpf } });

    if (!candidato) {
      throw new NotFoundException('Credenciais inválidas'); // 404
    }

    const senhaCorreta = await bcrypt.compare(dto.senha, candidato.senha_hash);

    if (!senhaCorreta) {
      throw new UnauthorizedException('Credenciais inválidas'); // 401
    }

    if (!candidato.verificado) {
      const novoCodigo = Math.floor(100000 + Math.random() * 900000).toString();
      candidato.codigoVerificacao = novoCodigo;

      await this.candidatoRepo.save(candidato);

      await this.mailerService.enviarCodigoVerificacao(candidato.email, novoCodigo, dto.cpf);

      throw new HttpException(
        'Enviamos um código de verificação para o seu e-mail. Verifique sua caixa de entrada ou spam.',
        HttpStatus.PRECONDITION_REQUIRED, // 428
      );
    }

    const payload = {
      sub: candidato.id,
      email: candidato.email,
      name: candidato.nome,
      role: 'candidato',
    };

    const access_token = await this.jwtService.signAsync(payload);

    return {
      access_token,
      sub: candidato.id,
    };
  }

  async updatedVerified(id: number) {
    const candidate = await this.candidatoRepo.findOne({ where: { id } });

    if (!candidate) {
      throw new NotFoundException('Candidato não encontrado');
    }

    candidate.verificado = false;

    await this.candidatoRepo.save(candidate);

    return { message: 'Verificação do candidato atualizada com sucesso.' };
  }
  async recuperarSenha(email: string) {
    const candidato = await this.candidatoRepo.findOne({ where: { email } });

    if (!candidato) {
      throw new UnauthorizedException('Candidato não encontrado com esse e-mail.');
    }

    // Gera o código de verificação
    const codigoRecuperacao = Math.floor(100000 + Math.random() * 900000).toString();

    // Salva o código no candidato (ou pode ser armazenado em uma tabela separada, dependendo do seu modelo)
    candidato.codigoVerificacao = codigoRecuperacao;
    await this.candidatoRepo.save(candidato);

    // Envia o código para o e-mail
    await this.mailerService.enviarCodigoRecuperacao(candidato.email, codigoRecuperacao);

    return { message: 'Código de recuperação enviado para o e-mail.' };


  }
  async alterarSenha(email: string, codigo: string, novaSenha: string) {
    const candidato = await this.candidatoRepo.findOne({ where: { email } });

    if (!candidato) {
      throw new UnauthorizedException('Candidato não encontrado com esse e-mail.');
    }

    if (candidato.codigoVerificacao !== codigo) {
      throw new UnauthorizedException('Código de recuperação inválido.');
    }

    // Criptografa a nova senha
    const senhaCriptografada = await bcrypt.hash(novaSenha, 8);

    candidato.senha_hash = senhaCriptografada;
    candidato.codigoVerificacao = null; // Limpa o código de verificação após a alteração da senha
    await this.candidatoRepo.save(candidato);

    return { message: 'Senha alterada com sucesso.' };
  }

}
