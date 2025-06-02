import express, { NextFunction, Request, Response } from 'express';
import { v4 as uuid } from 'uuid';
import { and, eq } from 'drizzle-orm';
import { transactionsSyncSchema, balancesSyncSchema } from '../../schema';
import { validateBody } from '../../../middleware';
import logger from '../../../utils/logger';
import { detailsService as service } from '../../../app';
import { db } from '../../../db';
import * as connector from '../../../goCardless/gocardless';
import { details, balance } from '../../../models';
import { getAccounts } from '../../../goCardless/gocardless';

const router = express.Router();

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const log = logger(req.cid);
    const { access: access_token } = await connector.retrieveAccessToken();

    const { account: acDetails } = await connector.accessAccountDetails(
      req.body.accountId,
      access_token
    );

    if (!acDetails) {
      log.error('Could not find account details');
      throw new Error('Could not find account details');
    }

    const { command, rowCount } = await db
      .insert(details)
      .values({
        id: req.body.accountId,
        ...acDetails,
      })
      .onConflictDoUpdate({
        target: [details.id],
        set: {
          resourceId: details.resourceId,
          iban: details.iban,
          scan: details.scan,
          currency: details.currency,
          ownerName: details.ownerName,
        },
      });
    res.status(200).send({
      message: `Data ${command} successfully into database!`,
      count: rowCount,
    });
  } catch (err) {
    next(err);
  }
});

router.post(
  '/transactions/sync',
  validateBody(transactionsSyncSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { accountId } = req.body;
      const resp: Object = await service.saveTransactionsToDB(
        accountId,
        req?.cid
      );

      if (
        typeof resp === 'object' &&
        resp !== null &&
        'command' in resp &&
        'rowCount' in resp
      )
        res.status(200).send({
          message: `Data ${resp.command} successfully into database!`,
          count: resp.rowCount,
        });
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  '/balances/sync',
  validateBody(balancesSyncSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    const { cid, body } = req;
    try {
      const log = logger(cid);
      const { access: access_token } = await connector.retrieveAccessToken();

      const { balances } = await connector.accessAccountBalance(
        body.accountId,
        access_token
      );

      if (balances.length === 0) {
        log.error('No account balances found');
        throw new Error('No account balances found');
      }

      const mappedBalances = balances.map((balance: any) => ({
        id: uuid(),
        accountDetailsId: body.accountId,
        balanceAmount: balance.balanceAmount,
        balanceType: balance.balanceType,
        referenceDate: balance.referenceDate,
      }));

      const [existingBalance] = await db
        .select()
        .from(balance)
        .where(eq(balance.accountDetailsId, body.accountId))
        .limit(1);
      let command: any;
      let rowCount: any;

      await db.transaction(async trx => {
        if (body.accountId === existingBalance?.accountDetailsId) {
          // this should only run if there is an existing accountId in the balances table
          await trx
            .delete(balance)
            .where(eq(balance.accountDetailsId, body.accountId));
          ({ command, rowCount } = await trx
            .insert(balance)
            .values(mappedBalances)
            .onConflictDoUpdate({
              target: [balance.id],
              set: {
                balanceAmount: balance.balanceAmount,
                balanceType: balance?.balanceType,
                referenceDate: balance?.referenceDate,
              },
            }));
        } else {
          // this should only run if there is no accountId in the balances table
          ({ command, rowCount } = await trx
            .insert(balance)
            .values(mappedBalances));
        }
      });

      res.status(200).send({
        message: `Data ${command} successfully into database!`,
        count: rowCount,
      });
    } catch (err) {
      next(err);
    }
  }
);

router.get(
  '/transactions',
  async (req: Request, res: Response, next: NextFunction) => {
    const { cid, query } = req;
    try {
      const { rows, pagination } =
        await service.retrieveTransactionsByAccountId(query, cid);

      res.status(200).send({
        response: rows,
        pagination,
      });
    } catch (err: any) {
      next(err);
    }
  }
);

router.get(
  '/get-balances',
  async (req: Request, res: Response, next: NextFunction) => {
    const { cid, query } = req;
    const accountId = query.accountId as string;

    const log = logger(cid);
    try {
      const balances = await db
        .select({
          id: balance.id,
          balanceAmount: balance.balanceAmount,
          balanceType: balance.balanceType,
          referenceDate: balance.referenceDate,
        })
        .from(balance)
        .where(and(eq(balance.accountDetailsId, accountId)));
      log.info('Balances loaded by account Id.');

      res.status(200).send({ res: balances });
    } catch (err: any) {
      next(err);
    }
  }
);

router.get(
  '/get-bank-details/:id',
  async (req: Request, res: Response, next: NextFunction) => {
    const { cid, params } = req;
    const accountId = params.id as string;

    const log = logger(cid);
    try {
      const [bankDetails] = await db
        .select({
          id: details.id,
          resourceId: details.resourceId,
          iban: details.iban,
          scan: details.scan,
          currency: details.currency,
          ownerName: details.ownerName,
        })
        .from(details)
        .where(and(eq(details.id, accountId)));
      log.info('Balances loaded by account Id.');

      res.status(200).send({ res: bankDetails });
    } catch (err: any) {
      next(err);
    }
  }
);

export default router;
