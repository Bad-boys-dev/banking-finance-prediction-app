import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { details, balance, transaction } from './models';

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: process.env.DB_USER,
  password: process.env.DB_PWD,
  database: 'gocardless_db',
  ssl: false,
});

export const db = drizzle(pool, {
  schema: {
    details,
    balance,
    transaction,
  },
});
