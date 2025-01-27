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
  bookingDate: varchar('bookingDate'),
  valueDate: varchar('valueDate'),
  bookingDateTime: date('bookingDateTime'),
  valueDateTime: date('valueDateTime'),
  transactionAmount: json('transactionAmount').notNull(),
  creditorName: varchar('creditorName'),
  creditorAccount: json('creditorAccount'),
  debtorName: varchar('debtorName'),
  debtorAccount: json('debtorAccount'),
  remittanceInformationUnstructuredArray: json(
    'remittanceInformationUnstructuredArray'
  ).notNull(),
  proprietaryBankTransactionCode: varchar(
    'proprietaryBankTransactionCode'
  ).notNull(),
  internalTransactionId: varchar('internalTransactionId').notNull(),
});

export default transactionSchema;
