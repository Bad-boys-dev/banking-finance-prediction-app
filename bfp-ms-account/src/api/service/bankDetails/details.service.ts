import { BadRequest } from '../../../errors';
import { IConnector, IAccessService } from '../../../types';
import { retrieveTransactions } from '../../../app';
import { transaction } from '../../../models';
import logger from '../../../utils/logger';

interface IDetailsService {
  saveBankDetails(log: object | any): Promise<Object>;
  saveTransactionsToDB(accountId: string, cid: string): Promise<Object>;
  saveBalancesToDB(
    body: { accountId: string },
    log: object | any
  ): Promise<Object>;
  retrieveBankDataFromDB(log: object | any): Promise<Array<Object>>;

  retrieveTransactionsByAccountId(
    query: any,
    cid: string | undefined
  ): Promise<any>;
}

class AccountsService implements IDetailsService {
  private readonly connector: IConnector;
  private readonly ops: any;
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

  async saveTransactionsToDB(accountId: string, cid: any): Promise<Object> {
    let transactions: any = {};
    const { bulkOps } = this.ops;

    try {
      const { access } = await this.connector.retrieveAccessToken();
      ({ transactions } = await this.connector.accessAccounts(
        accountId,
        access
      ));
    } catch (err: unknown) {
      this.log(cid).error('Failed to sync transactions');
    }

    if (transactions.booked?.length === 0)
      throw new BadRequest('No transactions found, hotshot!');

    let dbTransaction;
    if (typeof transactions === 'object' && 'booked' in transactions)
      dbTransaction = await bulkOps.bulkWriteOps(
        transactions?.booked,
        accountId
      );

    return dbTransaction;
  }

  retrieveBankDataFromDB(log: any): Promise<Array<Object>> {
    return Promise.resolve([]);
  }

  async retrieveTransactionsByAccountId(query: any, cid: string | undefined): Promise<any> {
    const accountId = String(query.accountId);

    const hasPagination = query.page && query.limit;

    const page = hasPagination ? Number(query.page) : undefined;
    const limit = hasPagination ? Number(query.limit) : undefined;
    const offSet = (page && limit) ? (page - 1) * limit : undefined;

    const { retrieveTransactions } = this.ops;

    try {
      const rows = await retrieveTransactions.getTransactionsByAccountId(
        accountId,
        { limit, offSet },
        {
          bookingDate: transaction.bookingDate,
          valueDate: transaction.valueDate,
          transactionAmount: transaction.transactionAmount,
          creditorName: transaction.creditorName,
          debtorName: transaction.debtorName,
          remittanceInformationUnstructuredArray:
          transaction.remittanceInformationUnstructuredArray,
          proprietaryBankTransactionCode:
          transaction.proprietaryBankTransactionCode,
          internalTransactionId: transaction.internalTransactionId,
        }
      );

      const totalCount = await retrieveTransactions.getTransactionCount(accountId);
      const totalPages = limit ? Math.ceil(totalCount / limit) : 1;

      this.log(cid).info('Loaded transactions from table successfully');
      return {
        rows,
        pagination: hasPagination
          ? {
            page,
            limit,
            offSet,
            totalPages,
          }
          : null,
      };
    } catch (err: any) {
      throw new Error(`Failed to retrieve transactions from DB: ${err.message}`);
    }
  }
}

export default AccountsService;
