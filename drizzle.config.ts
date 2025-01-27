import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';
import './bfp-ms-account/src/models'

export default defineConfig({
  out: './drizzle',
  schema: './bfp-ms-account/src/models',
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