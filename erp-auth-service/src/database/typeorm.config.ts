import { DataSource } from 'typeorm';
import { env } from '../config/env'; // <-- use your file
import 'dotenv/config';
export default new DataSource({
  type: 'postgres',

  host: env.db.host,
  port: env.db.port,
  username: env.db.username,
  password: env.db.password,
  database: env.db.database,

  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],

  synchronize: false,
  logging: true,
});
