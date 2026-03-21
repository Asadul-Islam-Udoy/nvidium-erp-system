import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config';
import { DataSource } from 'typeorm';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        host: '127.0.0.1', // Microservice host
        port: 4000, // Microservice port
      },
    },
  );

  // Optional: DB health check
  const dataSource = app.get(DataSource);
  try {
    await dataSource.query('SELECT 1');
    console.log('✅ Database connected successfully!');
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('❌ Database connection failed:', message);
  }

  await app.listen();
  console.log('🚀 Microservice running on TCP 127.0.0.1:4000');
}

bootstrap();
