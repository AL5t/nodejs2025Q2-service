import { DataSource } from 'typeorm';
import { config } from 'dotenv';

config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST || 'db',
  port: +(process.env.POSTGRES_PORT || 5432),
  username: process.env.POSTGRES_USER || 'admin',
  password: process.env.POSTGRES_PASSWORD || '123qwe',
  database: process.env.POSTGRES_DB || 'hlsdb',
  entities: ['dist/**/*.entity{.js,.ts}'],
  migrations: ['dist/migrations/*{.js,.ts}'],
  synchronize: false,
});
