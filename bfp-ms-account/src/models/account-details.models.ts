import { text, varchar, pgTable, json } from 'drizzle-orm/pg-core';

const accountsSchema = pgTable('accounts', {
  id: text('id').primaryKey(),
  resourceId: varchar('resourceId'),
  iban: varchar('iban'),
  scan: varchar('scan'),
  currency: varchar('currency').notNull(),
  ownerName: varchar('ownerName'),
  balances: json('balances'),
});

export default accountsSchema;