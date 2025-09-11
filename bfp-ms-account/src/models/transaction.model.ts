import {
  pgTable,
  varchar,
  date,
  json,
  text,
  AnyPgColumn,
} from 'drizzle-orm/pg-core';
import { details } from './index';

const transactionSchema = pgTable('transactions', {
  id: text('id').primaryKey(),
  accountDetailsId: text('account_Details_Id').references(
    (): AnyPgColumn => details.id
  ),
  bookingDate: date('booking_date').notNull(),
  valueDate: date('value_date').notNull(),
  transactionAmount: json('transaction_amount').notNull(),
  creditorName: varchar('creditor_name').notNull(),
  creditorAccount: json('creditor_account'),
  debtorName: varchar('debtor_name').notNull(),
  debtorAccount: json('debtor_account'),
  transactionName: varchar('transaction_name').notNull(),
  transactionType: varchar('transaction_type').notNull(),
});

export default transactionSchema;
