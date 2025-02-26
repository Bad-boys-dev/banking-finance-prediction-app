import { v4 as uuid } from 'uuid';
import { eq } from 'drizzle-orm';
import { db } from '../../../db';
import { details, transaction as tSchema, balance } from '../../../models';
import generateUid from '../../../utils/generateUid';
import * as connector from '../../../goCardless/gocardless';
import { BadRequest } from '../../../errors';
import logger from '../../../utils/logger';

const getAccountDetailId = async (ownerName: string) => {
  const accountDetail: any = await db
    .select({ id: details.id })
    .from(details)
    .where(eq(details.ownerName, ownerName))
    .limit(1);
  console.log('...accountDetail', accountDetail);
  return accountDetail?.length > 0 ? accountDetail[0].id : null;
};

const saveBankDetails = async (accountId: string) => {
  let command, rowCount;

  const { access: access_token } = await connector.retrieveAccessToken();
  let acDetails: any;

  try {
    ({ account: acDetails } = await connector.accessAccountDetails(
      accountId,
      access_token
    ));
  } catch (err: any) {
    logger().error('Failed to retrieve account details');
    throw new Error('Failed to retrieve account details');
  }

  try {
    //@ts-ignore
    ({ command, rowCount } = await db.insert(details).values({
      id: uuid(),
      ...acDetails,
    }));
  } catch (err) {
    logger().error('Failed to ingest account details');
    throw err;
  }

  return { command, rowCount };
};

const saveTransactionsToDB = async (accountId: string, ownerName: string) => {
  if (!accountId)
    throw new Error('AccountId is missing, please add to proceed!');

  const { access: access_token } = await connector.retrieveAccessToken();
  let transactions: any;

  try {
    ({ transactions } = await connector.accessAccounts(
      accountId,
      access_token
    ));

    if (transactions.length === 0)
      throw new BadRequest(
        'No transactions available, please try and connect to bank again'
      );
  } catch (err: any) {
    logger().error('Failed to acquire end user account transactions');
    throw new Error(err.message);
  }

  const response = transactions?.booked;
  let command, rowCount;

  try {
    const accountDetailsId = await getAccountDetailId(ownerName);

    // @ts-ignore
    console.log('...accountDetail.id', accountDetailsId);

    const mappedTransactions = response?.map((transaction: any) => ({
      id: generateUid({
        creditorName: transaction.creditorName,
        debtorName: transaction.debtorName,
      }),
      accountDetailsId,
      ...transaction,
    }));

    //@ts-ignore
    ({ command, rowCount } = await db
      .insert(tSchema)
      .values(mappedTransactions));

    return { command, rowCount };
  } catch (err) {
    console.error(err);
    logger().error('Failed to save transactions to DB');
    throw err;
  }
};

const saveBalancesToDB = async (body: { accountId: string, ownerName: string }, log: object|any) => {
  const { accountId, ownerName } = body;

  let command, rowCount;
  const { access: access_token } = await connector.retrieveAccessToken();
  let balances: any;

  try {
    ({ balances } = await connector.accessAccountBalance(
      accountId,
      access_token
    ));
  } catch (err: any) {
    log.error('Failed to retrieve balances', { errMsg: err.message });
    throw new Error('Failed to access the Account balance.');
  }

  try {
    const accountDetailsId = await getAccountDetailId(ownerName);
    // @ts-ignore
    console.log('...accountDetail.id', accountDetailsId);

    const mappedBalances: any = balances?.map((balance: any) => ({
      id: uuid(),
      accountDetailsId,
      ...balance,
    }));
    //@ts-ignore
    ({ command, rowCount } = await db.insert(balance).values(mappedBalances));

    log.info('Successfully ingested retrieved balances', { count: rowCount });
  } catch (err: any) {
    log.error('Failed to ingest balances');
    throw err;
  }

  return { command, rowCount };
};

const retrieveBankDataFromDB = async (log: object|any) => {
  try {
    const response = await db
      .select({
        accountId: details.id,
        ownerName: details.ownerName,
        iban: details.iban,
        transactionId: tSchema.id,
        transactionAmount: tSchema.transactionAmount,
        valueDate: tSchema.valueDate,
        valueDateTime: tSchema.valueDateTime,
        remittanceInformationUnstructuredArray:
          tSchema.remittanceInformationUnstructuredArray,
        balanceAmount: balance.balanceAmount,
        referenceDate: balance.referenceDate,
        balanceId: balance.id,
      })
      .from(details)
      .leftJoin(tSchema, eq(details.id, tSchema.accountDetailsId))
      .leftJoin(balance, eq(details.id, balance.accountDetailsId));

    type BankDeets = {
      id: string;
      ownerName: string;
      iban?: string;
      balanceAmount?: {
        amount?: string;
        currency?: string;
      };
      referenceDate?: string;
      balanceId: string;
      transactions: {
        id: string;
        transactionAmount: {
          amount: string;
          currency: string;
        };
        receiver: Array<String>;
        valueDate: string;
        valueDateTime: string;
      }[];
    };

    const fullBankAccount: BankDeets[] = [];

    for (const row of response) {
      //  transform response object above to include transactions list inside the same obj as user details object
      let bankDetail: any = fullBankAccount.find(
        acc => acc.id === row.accountId
      );

      if (!bankDetail) {
        bankDetail = {
          id: row.accountId,
          iban: row.iban,
          ownerName: row.ownerName,
          transactions: [],
        };
        fullBankAccount.push(bankDetail);
      }

      let transaction: any = bankDetail.transactions.find(
        (transaction: any) => transaction.id === row.transactionId
      );

      if (!transaction && row.transactionId) {
        transaction = {
          id: row.transactionId,
          transactionAmount: row.transactionAmount,
          valueDate: row.valueDate,
          valueDateTime: row.valueDateTime,
          receiver: row.remittanceInformationUnstructuredArray,
        };
        bankDetail.transactions.push(transaction);
      }

      if (row.balanceId) {
        bankDetail['balanceAmount'] = row.balanceAmount;
        bankDetail['referenceDate'] = row.referenceDate;
      }
    }
    log.info('Successfully loaded full transactions');

    return fullBankAccount;
  } catch (err) {
    log.error('Failed to retrieve bank details');
    throw err;
  }
};

export const service = {
  saveBankDetails,
  saveTransactionsToDB,
  saveBalancesToDB,
  retrieveBankDataFromDB,
};
