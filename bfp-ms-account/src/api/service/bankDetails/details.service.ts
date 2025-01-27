import { v4 as uuid } from 'uuid';
import { db } from '../../../db';
import { details, transaction as tSchema } from '../../../models';
import { account, transactions, balances } from '../../../utils/bankDetails.json';
import generateUid from '../../../utils/generateUid';
import { eq } from 'drizzle-orm';

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
  const response = transactions?.booked;
  let command, rowCount;

  try {
    const mappedTransactions = response?.map((transaction: any) => ({
      id: generateUid({
        creditorName: transaction.creditorName,
        debtorName: transaction.debtorName,
      }),
      accountDetailsId: accountId,
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
        valueDate: string;
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
  retrieveBankDataFromDB,
};
