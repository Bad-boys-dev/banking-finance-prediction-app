// import { D } from 'drizzle-orm'
import { inArray, not } from 'drizzle-orm';
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

  bulkWriteOps = async (transactions: object[]) => {
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
    const currentIds = _.map(mappedTransactions, transaction => transaction.id);
    let command;
    let rowCount;

    await this.db.transaction(async trx => {
      await trx
        .delete(this.model)
        .where(not(inArray(this.model?.id, currentIds)));

      ({ command, rowCount } = await trx
        .insert(this.model)
        .values(mappedTransactions));
    });
    return {
      command,
      rowCount,
    };
  };
}

export default BulkOps;
