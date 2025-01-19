import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './drizzle',
  schema: './src/db/*.ts',
  dialect: 'postgresql',
  dbCredentials: {
    host: 'localhost',
    url: process.env.DATABASE_URL!,
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    database: 'gocardless_db',
    ssl: false
  },
});