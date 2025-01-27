export default (dbPayload: any) => async (body: any) => {
  const { db, transactions, not, inArray } = dbPayload;

  let command;
  let rowCount;

  await db.transaction(async (trx: any) => {
    await trx
      .delete(transactions)
      .where(
        not(
          inArray(transactions && transactions.id, body?.incomingTransactionIds)
        )
      );

    ({ command, rowCount } = await trx
      .insert(transactions)
      .values(body?.mappedTransactions));
  });

  return { command, rowCount };
};
