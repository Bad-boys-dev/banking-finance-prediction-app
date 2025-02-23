import { pgTable, text, varchar, json, AnyPgColumn } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { details } from './index';

const balance = pgTable('balances', {
  id: text('id').primaryKey(),
  accountDetailsId: text('account_Details_Id').references(
    (): AnyPgColumn => details.id
  ),
  balanceAmount: json('balanceAmount').notNull(),
  balanceType: varchar('balanceType'),
  referenceDate: varchar('referenceDate'),
});

// const balanceRelations = relations(balance, ({ one }) => ({
//   details: one(details),
// }));

export default balance;
