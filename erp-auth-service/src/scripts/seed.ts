import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { SeedService } from '../database/seeds/seed.service';

async function bootstrap() {
  // start NestJS WITHOUT HTTP server
  const app = await NestFactory.createApplicationContext(AppModule);

  // get seed service
  const seedService = app.get(SeedService);

  // run seed
  await seedService.seed();

  // close app
  await app.close();
}

bootstrap();
