import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import * as express from 'express'; // <-- faltando
import { join } from 'path';        // <-- faltando
import { env } from './env';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.use(helmet());
  app.enableCors({
    origin: '*',  // Permite todos os domínios
  });

  app.use((req, res, next) => {
    res.setHeader('Content-Security-Policy', "frame-ancestors *");
    next();
  });

  app.use('/upload', express.static(join(__dirname, '..', 'uploads')));
  await app.listen(env.PORT || 3000);
}
bootstrap();
