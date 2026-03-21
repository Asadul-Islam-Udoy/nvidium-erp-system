import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import fastifyCookie from '@fastify/cookie';
import 'dotenv/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  // Register cookie parser
  await app.register(fastifyCookie, {
    secret: process.env.COOKIE_SECRET || 'super-secret',
    parseOptions: {}, // optional settings
  });

  app.enableCors({ origin: 'http://localhost:4200', credentials: true });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  app.setGlobalPrefix('api');

  await app.listen(3000, '0.0.0.0');
  console.log('🚀 API Gateway running on http://localhost:3000');
}

bootstrap();
