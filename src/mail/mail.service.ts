// src/mailer/mailer.service.ts
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { env } from 'src/env';

@Injectable()
export class MailerService {
  private transporter = nodemailer.createTransport({
    host: env.EMAIL_HOST,
    port: 587,
    secure: false,
    auth: {
      user: env.EMAIL_USER,
      pass: env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  async enviarCodigoVerificacao(email: string, codigo: string, cpf: string) {
    const html = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4; padding: 30px;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; padding: 40px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); border-top: 10px solid #00009B;">
        
        <h2 style="color: #00009B; text-align: center;">Verifique seu e-mail</h2>
        
        <p style="font-size: 16px; color: #333;">Olá,</p>
  
        <p style="font-size: 16px; color: #333;">
          Para concluir seu cadastro no sistema de Processos Seletivos da <strong>Prefeitura de Ibirité</strong>, clique no botão abaixo:
        </p>
  
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://psseduc.ibirite.mg.gov.br/user/login/verification?cpf=${encodeURIComponent(cpf)}&codigo=${encodeURIComponent(codigo)}"
             style="display: inline-block; padding: 14px 28px; background-color: #00009B; color: #fff; text-decoration: none; font-size: 16px; border-radius: 6px;">
            Verificar agora
          </a>
        </div>
  
        <p style="font-size: 14px; color: #666;">
          Caso você não tenha solicitado este código, ignore este e-mail.
        </p>
  
        <p style="font-size: 14px; color: #666;">
          Atenciosamente,<br>
          <strong>Equipe de Processos Seletivos - Prefeitura de Ibirité</strong>
        </p>
      </div>
    </div>
  `;



    await this.transporter.sendMail({
      from: `"Prefeitura de Ibirité" ${env.EMAIL_FROM}`,
      to: email,
      subject: 'Código de Verificação',
      html,
    });
  }
  async enviarCodigoRecuperacao(email: string, codigo: string) {
    const html = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8f8f8; padding: 40px;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; padding: 40px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); border-top: 10px solid #0066cc;">
        <h2 style="color: #0066cc; text-align: center; font-size: 24px; font-weight: bold; margin-bottom: 20px;">Recuperação de Senha</h2>
        
        <p style="font-size: 16px; color: #333; text-align: center;">
          Olá,<br>
          Você solicitou a recuperação de sua senha. Para continuar, clique no botão para definir uma nova senha:
        </p>
  
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://psseduc.ibirite.mg.gov.br/user/login/verification?recoveryPassword=true&codigo=${encodeURIComponent(codigo)}&email=${encodeURIComponent(email)}"
             style="display: inline-block; padding: 14px 28px; background-color: #0066cc; color: #fff; text-decoration: none; font-size: 16px; border-radius: 6px; text-transform: uppercase; font-weight: bold;">
            Definir Nova Senha
          </a>
        </div>
  
        <p style="font-size: 14px; color: #666; text-align: center;">
          Caso você não tenha solicitado esta recuperação de senha, por favor, ignore este e-mail.
        </p>
  
        <div style="text-align: center; margin-top: 40px; font-size: 12px; color: #aaa;">
          <p>Atenciosamente,<br>
          <strong>Equipe de Processos Seletivos - Prefeitura de Ibirité</strong></p>
          <p>Se tiver dúvidas, entre em contato conosco.</p>
        </div>
      </div>
    </div>
  `;

    await this.transporter.sendMail({
      from: `"Prefeitura de Ibirité" <${env.EMAIL_FROM}>`,
      to: email,
      subject: 'Código de Recuperação de Senha',
      html,
    });
  }

}
