import { inArray, not, sql } from 'drizzle-orm';
import { DrizzleD1Database } from 'drizzle-orm/d1';
import _ from 'lodash';
import generateUid from '../utils/generateUid';

class BulkOps {
  private db: DrizzleD1Database;
  private model: any;

  constructor(db: DrizzleD1Database, model: any) {
    this.db = db;
    this.model = model;
  }

  bulkWriteOps = async (transactions: object[], accountId: string) => {
    const mappedTransactions = _.map(
      transactions,
      (transaction: object | any) => ({
        id: generateUid({
          creditorName: transaction.creditorName,
          debtorName: transaction.debtorName,
        }),
        accountDetailsId: accountId,
        ...transaction,
      })
    );
    // const currentIds = _.map(mappedTransactions, transaction => transaction.id);
    const { command, rowCount } = await this.db
      .insert(this.model)
      .values(mappedTransactions)
      .onConflictDoUpdate({
        target: this.model.id,
        set: {
          bookingDate: sql`${this.model.bookingDate}`,
          valueDate: sql`${this.model.valueDate}`,
          bookingDateTime: sql`${this.model.bookingDateTime}`,
          valueDateTime: sql`${this.model.valueDateTime}`,
          transactionAmount: sql`${this.model.transactionAmount}`,
          creditorName: sql`${this.model.creditorName}`,
          creditorAccount: sql`${this.model.creditorAccount}`,
          debtorName: sql`${this.model.debtorName}`,
          debtorAccount: sql`${this.model.debtorAccount}`,
          remittanceInformationUnstructuredArray: sql`${this.model.remittanceInformationUnstructuredArray}`,
          proprietaryBankTransactionCode: sql`${this.model.proprietaryBankTransactionCode}`,
          internalTransactionId: sql`${this.model.internalTransactionId}`,
        },
      });
    return {
      command,
      rowCount,
    };
  };
}

export default BulkOps;
