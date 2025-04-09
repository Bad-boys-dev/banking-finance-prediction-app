// import { v4 as uuid } from 'uuid';
// import { eq, sql } from 'drizzle-orm';
// import { db } from '../../../db';
// import { details, transaction as tSchema, balance } from '../../../models';
// import generateUid from '../../../utils/generateUid';
// import * as connector from '../../../goCardless/gocardless';
// import { BadRequest } from '../../../errors';
//
// interface IDetailsService {
//   saveBankDetails(accountId: string, log: object | any): Promise<Object>;
//   saveTransactionsToDB(accountId: string, log: object | any): Promise<Object>;
//   saveBalancesToDB(
//     body: { accountId: string },
//     log: object | any
//   ): Promise<Object>;
//   retrieveBankDataFromDB(log: object | any): Promise<Array<Object>>;
//   // retrieveTransactionsByAccountId(query: { accountId: string; page: number; limit: number } | any,log: object | any): Promise<Object>
// }
// interface IConnector {}
//
// class AccountsService implements IDetailsService {
//   private readonly connector: IConnector;
//   public db: any;
//   private log: object | any;
//
//   constructor(connector: IConnector, db: any, log: object | any) {
//     this.connector = connector;
//     this.db = db;
//     this.log = log;
//   }
//
//   // retrieveTransactionsByAccountId(query: any, log: any): Promise<Object> {
//   //   return Promise.resolve(undefined);
//   // }
//
//   saveBalancesToDB(body: { accountId: string }, log: any): Promise<Object> {
//     return Promise.resolve(undefined);
//   }
//
//   saveBankDetails(accountId: string, log: any): Promise<Object> {
//     return Promise.resolve(undefined);
//   }
//
//   saveTransactionsToDB(accountId: string, log: any): Promise<Object> {
//     return Promise.resolve(undefined);
//   }
//
//   retrieveBankDataFromDB(log: any): Promise<Array<Object>> {
//     return Promise.resolve([]);
//   }
// }
//
// export default AccountsService;
