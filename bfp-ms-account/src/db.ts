import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: process.env.DB_USER,
  password: process.env.DB_PWD,
  database: 'gocardless_db',
  ssl: false,
})

export const db = drizzle(pool);