import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        host: process.env.HOST ?? 'localhost',
        port: parseInt(process.env.PORT ?? '4000'),
      },
    },
  );
  await app.listen();

  console.log(
    `Microservice is listening on ${
      process.env.HOST ?? 'localhost'
    }:${process.env.PORT ?? '4000'}`,
  );
}
bootstrap();
