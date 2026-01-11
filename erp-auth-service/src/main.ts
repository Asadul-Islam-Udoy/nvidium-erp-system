import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import fastifyCookie from '@fastify/cookie';
import 'dotenv/config';
import { DataSource } from 'typeorm';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { ValidationPipe } from '@nestjs/common';
async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  await app.register(fastifyCookie, {
    secret: process.env.COOKIE_SECRET || 'super-secret',
    parseOptions: {},
  });
  app.enableCors({ origin: 'http://localhost:4200', credentials: true });
  const dataSource = app.get(DataSource);
  app.useGlobalFilters(new AllExceptionsFilter());
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  try {
    await dataSource.query('SELECT 1');
    console.log('✅ Database connected successfully!');
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('❌ Database connection failed:', message);
  }

  await app.listen(3000, '0.0.0.0');
  console.log('🚀 Server running on http://localhost:3000');
}
bootstrap();
