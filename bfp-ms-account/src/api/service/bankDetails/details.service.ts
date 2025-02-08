import { v4 as uuid } from 'uuid';
import { eq } from 'drizzle-orm';
import { db } from '../../../db';
import { details, transaction as tSchema, balance } from '../../../models';
import {
  account,
  // transactions,
  balances,
} from '../../../utils/bankDetails.json';
import generateUid from '../../../utils/generateUid';
import * as connector from '../../../goCardless/gocardless';
import { BadRequest } from '../../../errors';

const saveBankDetails = async () => {
  const response = account;
  let command;
  let rowCount;

  try {
    //@ts-ignore
    ({ command, rowCount } = await db.insert(details).values({
      id: uuid(),
      ...response,
    }));
  } catch (err) {
    console.error(err);
    throw err;
  }

  return { command, rowCount };
};

const saveTransactionsToDB = async (accountId: string) => {
  console.log(accountId);

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
    console.log('Failed to acquire end user account transactions:', err);
    throw new Error(err.message);
  }

  const response = transactions?.booked;
  let command, rowCount;

  try {
    const mappedTransactions = response?.map((transaction: any) => ({
      id: generateUid({
        creditorName: transaction.creditorName,
        debtorName: transaction.debtorName,
      }),
      accountDetailsId: 'd2498872-6ac3-480c-b4ef-da4454770ef2', //TODO: to replace with request body input later
      ...transaction,
    }));

    console.log('...mappedTransactions', mappedTransactions);
    console.log('...accountId:', accountId);

    //@ts-ignore
    ({ command, rowCount } = await db
      .insert(tSchema)
      .values(mappedTransactions));

    return { command, rowCount };
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const saveBalancesToDB = async (accountId: string) => {
  const resp = balances;

  let command;
  let rowCount;
  try {
    const mappedBalances = resp?.map((balance: any) => ({
      id: uuid(),
      accountDetailsId: accountId,
      ...balance,
    }));
    //@ts-ignore
    ({ command, rowCount } = await db.insert(balance).values(mappedBalances));
  } catch (err: any) {
    console.error(err);
    throw err;
  }

  return { command, rowCount };
};

const retrieveBankDataFromDB = async () => {
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
      })
      .from(details)
      .leftJoin(tSchema, eq(details.id, tSchema.accountDetailsId));

    type BankDeets = {
      id: string;
      ownerName: string;
      iban: string;
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
    }

    return fullBankAccount;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const service = {
  saveBankDetails,
  saveTransactionsToDB,
  saveBalancesToDB,
  retrieveBankDataFromDB,
};
