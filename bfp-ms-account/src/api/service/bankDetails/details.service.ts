import { v4 as uuid } from 'uuid';
import { eq, sql } from 'drizzle-orm';
import { db } from '../../../db';
import { details, transaction as tSchema, balance } from '../../../models';
import generateUid from '../../../utils/generateUid';
import * as connector from '../../../goCardless/gocardless';
import { BadRequest } from '../../../errors';
import { IConnector, IAccessService } from '../../../types';
import { accessAccounts } from '../../../goCardless/gocardless';

interface IDetailsService {
  saveBankDetails(log: object | any): Promise<Object>;
  saveTransactionsToDB(accountId: string, cid: string): Promise<Object>;
  saveBalancesToDB(
    body: { accountId: string },
    log: object | any
  ): Promise<Object>;
  retrieveBankDataFromDB(log: object | any): Promise<Array<Object>>;
  // retrieveTransactionsByAccountId(query: { accountId: string; page: number; limit: number } | any,log: object | any): Promise<Object>
}
// interface IConnector {}

class AccountsService implements IDetailsService {
  private readonly connector: IConnector;
  private ops: any;
  private log: object | any;

  constructor(connector: IConnector, ops: any, log: object | any) {
    this.connector = connector;
    this.ops = ops;
    this.log = log;
  }

  // retrieveTransactionsByAccountId(query: any, log: any): Promise<Object> {
  //   return Promise.resolve(undefined);
  // }

  async saveBalancesToDB(
    body: { accountId: string },
    log: any
  ): Promise<Object> {
    return Promise.resolve({});
  }

  saveBankDetails(log: any): Promise<Object> {
    return Promise.resolve({});
  }

  async saveTransactionsToDB(accountId: string, cid: string): Promise<Object> {
    let transactions: any = {};

    try {
      const { access } = await this.connector.retrieveAccessToken();
      ({ transactions } = await this.connector.accessAccounts(
        accountId,
        access
      ));
    } catch (err: unknown) {
      this.log(cid).error('Failed to sync transactions');
    }

    if (transactions.booked.length === 0)
      throw new BadRequest('No transactions found, hotshot!');

    let dbTransaction;
    if (typeof transactions === 'object' && 'booked' in transactions)
      dbTransaction = await this.ops.bulkWriteOps(
        transactions?.booked,
        accountId
      );

    return dbTransaction;
  }

  retrieveBankDataFromDB(log: any): Promise<Array<Object>> {
    return Promise.resolve([]);
  }
}

export default AccountsService;
