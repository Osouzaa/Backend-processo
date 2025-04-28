import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import * as express from 'express';
import { join } from 'path';
import { env } from './env';
import * as fs from 'fs';

async function bootstrap() {

  const keyFile = fs.readFileSync(__dirname + '/../src/certs/key.pem');
  const certFile = fs.readFileSync(__dirname + '/../src/certs/cert.pem');

  const app = await NestFactory.create(AppModule, {
    httpsOptions: {
      key: keyFile,
      cert: certFile
    }
  });

  app.useGlobalPipes(new ValidationPipe());
  app.use(helmet());
  app.enableCors({ origin: '*' });

  app.use((req, res, next) => {
    res.setHeader('Content-Security-Policy', 'frame-ancestors *');
    next();
  });

  app.use('/upload', express.static(join(__dirname, '..', 'uploads')));

  await app.listen(env.PORT || 3333);
}
bootstrap();
