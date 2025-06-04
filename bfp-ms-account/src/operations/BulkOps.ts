import { inArray, not, sql, eq } from 'drizzle-orm';
import { DrizzleD1Database } from 'drizzle-orm/d1';
import _ from 'lodash';
import { v4 as uuid } from 'uuid';
import generateUid from '../utils/generateUid';
import { balance } from '../models';

class BulkOps {
  db: DrizzleD1Database;
  model: any;

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

    let command: any;
    let rowCount: any;

    await this.db.transaction(async trx => {
      await trx
        .delete(this.model)
        .where(eq(this.model.accountDetailsId, accountId));

      ({ command, rowCount } = await trx
        .insert(this.model)
        .values(mappedTransactions)
        .onConflictDoUpdate({
          target: [this.model.id],
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
        }));
    });
    console.log('...insert info', command, rowCount);
    console.log('...mappedTransactions', mappedTransactions);
    console.log(
      '...does this accountId exist?',
      accountId === this.model.accountDetailsId ? 'yes' : 'no'
    );
    console.log('...accountId?', accountId === this.model.accountDetailsId);

    // const { command, rowCount } = await this.db
    //   .insert(this.model)
    //   .values(mappedTransactions)
    //   .onConflictDoUpdate({
    //     target: [this.model.id],
    //     set: {
    //       bookingDate: sql`${this.model.bookingDate}`,
    //       valueDate: sql`${this.model.valueDate}`,
    //       bookingDateTime: sql`${this.model.bookingDateTime}`,
    //       valueDateTime: sql`${this.model.valueDateTime}`,
    //       transactionAmount: sql`${this.model.transactionAmount}`,
    //       creditorName: sql`${this.model.creditorName}`,
    //       creditorAccount: sql`${this.model.creditorAccount}`,
    //       debtorName: sql`${this.model.debtorName}`,
    //       debtorAccount: sql`${this.model.debtorAccount}`,
    //       remittanceInformationUnstructuredArray: sql`${this.model.remittanceInformationUnstructuredArray}`,
    //       proprietaryBankTransactionCode: sql`${this.model.proprietaryBankTransactionCode}`,
    //       internalTransactionId: sql`${this.model.internalTransactionId}`,
    //     },
    //   });
    return {
      command,
      rowCount,
    };
  };

  // async bulkWriteBankDetails(detail: object) {
  //   const { command, rowCount } = await this.db.insert(this.model)
  // }
}

export default BulkOps;
