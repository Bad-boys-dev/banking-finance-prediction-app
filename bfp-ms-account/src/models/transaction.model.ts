import { pgTable, varchar, date, json, text, AnyPgColumn } from 'drizzle-orm/pg-core';
import {details, balance} from './index';

const transactionSchema = pgTable('transactions', {
  id: text('id').primaryKey(),
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
  accountDetailsId: text(
    'account_Details_Id'
  ).references((): AnyPgColumn =>
    details.id
  ),
  accountBalanceId: text(
    'account_Balance_Id'
  ).references((): AnyPgColumn =>
    balance.id
  )
})

export default transactionSchema;