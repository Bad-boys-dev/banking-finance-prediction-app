import { pgTable, text, varchar, json } from 'drizzle-orm/pg-core';

const balance = pgTable('balance', {
  id: text('id').primaryKey(),
  balanceAmount: json('balanceAmount').notNull(),
  balanceType: varchar('balanceType'),
  referenceDate: varchar('referenceDate')
})
export default balance;