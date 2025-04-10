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
          bookingDate: sql`excluded.bookingDate`,
          valueDate: sql`excluded.valueDate`,
          bookingDateTime: sql`excluded.bookingDateTime`,
          valueDateTime: sql`excluded.valueDateTime`,
          transactionAmount: sql`excluded.transactionAmount`,
          creditorName: sql`excluded.creditorName`,
          creditorAccount: sql`excluded.creditorAccount`,
          debtorName: sql`excluded.debtorName`,
          debtorAccount: sql`excluded.debtorAccount`,
          remittanceInformationUnstructuredArray: sql`excluded.remittanceInformationUnstructuredArray`,
          proprietaryBankTransactionCode: sql`excluded.proprietaryBankTransactionCode`,
          internalTransactionId: sql`excluded.internalTransactionId`,
        },
      });
    return {
      command,
      rowCount,
    };
  };
}

export default BulkOps;
