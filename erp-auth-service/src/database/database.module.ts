import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { env } from '../config/env';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: env.db.host,
      port: env.db.port,
      username: env.db.username,
      password: env.db.password,
      database: env.db.database,
      autoLoadEntities: true,
      synchronize: false,
      logging: env.nodeEnv === 'development',
    }),
  ],
})
export class DatabaseModule {}
