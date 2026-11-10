import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env if present
dotenv.config();

export const ENV = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '5000', 10),
  DATABASE_URL: process.env.DATABASE_URL || '',
  PGHOST: process.env.PGHOST || 'localhost',
  PGUSER: process.env.PGUSER || 'postgres',
  PGPASSWORD: process.env.PGPASSWORD || '',
  PGDATABASE: process.env.PGDATABASE || 'smart_timetable',
  PGPORT: parseInt(process.env.PGPORT || '5432', 10),
  JWT_SECRET: process.env.JWT_SECRET || 'smart_timetable_jwt_secret_academic_system_2026',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '24h',
  CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
  DATA_DIR: process.env.DATA_DIR || path.resolve(process.cwd(), 'backend/data/smart_timetable_pgdata')
};
