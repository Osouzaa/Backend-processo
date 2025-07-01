import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';
import { join } from 'path';
import { env } from './env';
import helmet from 'helmet';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const start = Date.now();
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  // Segurança básica
  app.use(helmet());

  // CORS liberado para todos os domínios (ajuste conforme necessário)
  app.enableCors({
    allowedHeaders: "*",
    origin: "*",
  });

  // Middleware para logar as requisições
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} request made to: ${req.originalUrl}`);
    next();
  });

  // Header para permitir que o site seja exibido dentro de iframes, caso necessário
  app.use((req, res, next) => {
    res.setHeader('Content-Security-Policy', 'frame-ancestors *');
    next();
  });

  // Servindo arquivos estáticos da pasta "uploads"
  app.use(express.static(join(__dirname, '..', 'uploads')));

  // Inicializando a aplicação
  await app.listen(env.PORT || 3443, '0.0.0.0');
  console.log(`✅ API rodando em: https://apipsseduc.ibirite.mg.gov.br:${env.PORT || 3443}`);

  const duration = Date.now() - start;
  console.log(`Tempo total de startup: ${duration}ms`);
}

bootstrap();
