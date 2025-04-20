import express, { NextFunction, Request, Response } from 'express';
import { and, count, eq, sql } from 'drizzle-orm';
// import { service } from '../../service/bankDetails/details.service';
import { transactionsSyncSchema, balancesSyncSchema } from '../../schema';
import { validateBody } from '../../../middleware';
import logger from '../../../utils/logger';
import { detailsService as service } from '../../../app';
import { db } from '../../../db';
import { details, transaction } from '../../../models';

const router = express.Router();

// router.post('/', async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const log = logger(req.cid);
//     const resp = await service.saveBankDetails(req.body.accountId, log);
//     res.status(200).send({
//       message: `Data ${resp.command} successfully into database!`,
//       count: resp.rowCount,
//     });
//   } catch (err) {
//     next(err);
//   }
// });
//
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

// router.post(
//   '/balances/sync',
//   validateBody(balancesSyncSchema),
//   async (req: Request, res: Response, next: NextFunction) => {
//     const { cid, body } = req;
//     try {
//       const log = logger(cid);
//       const resp = await service.saveBalancesToDB(body, log);
//       res.status(200).send({
//         message: `Data ${resp.command} successfully into database!`,
//         count: resp.rowCount,
//       });
//     } catch (err) {
//       next(err);
//     }
//   }
// );

// Endpoint to get return account data for the purposes fo predicating
// router.get('/', async (req: Request, res: Response, next: NextFunction) => {
//   const { cid, query } = req;
//   const accountId = String(query.accountId);
//   console.log('accountId', accountId);
//   try {
//     const log = logger(cid);
//     const response = await service.retrieveBankDataFromDB(log);
//
//     res.status(200).send({ response });
//   } catch (err: any) {
//     next(err);
//   }
// });
//@ts-ignore
router.get(
  '/transactions',
  //@ts-ignore
  async (req: Request, res: Response, next: NextFunction) => {
    const { cid, query } = req;
    const accountId = String(query.accountId);

    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 5;

    const offSet = (page - 1) * limit;
    try {
      const rows: any[] = await db
        .select({
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
        })
        .from(transaction)
        // .innerJoin(details, eq(transaction.accountDetailsId, details.id))
        .where(and(eq(transaction.accountDetailsId, accountId)))
        .limit(limit)
        .offset(offSet);

      if (rows.length === 0) return [];

      const count = await db
        //@ts-ignore
        .select({ count: sql<number>`count(*)` })
        .from(transaction)
        .innerJoin(details, eq(transaction.accountDetailsId, details.id))
        .where(and(eq(details.id, accountId)));

      //@ts-ignore
      const totalCount = count[0].count;
      const totalPages = Math.ceil(totalCount / limit);

      logger(cid).info('Loaded transactions from table successfully');

      res.status(200).send({
        response: rows,
        pagination: {
          pages: page,
          limit,
          offSet,
          totalPages,
        },
      });
    } catch (err: any) {
      next(err);
    }
  }
);

// router.get(
//   '/transactions',
//   async (req: Request, res: Response, next: NextFunction) => {
//     const { query, cid } = req;
//     try {
//       const log = logger(cid);
//       const { resp, page, limit, offSet, totalPages } =
//         await service.retrieveTransactionsByAccountId(query, log);
//
//       res.status(200).send({
//         data: resp,
//         pagination: {
//           pages: page,
//           limit,
//           offSet,
//           totalPages,
//         },
//       });
//     } catch (err) {
//       next(err);
//     }
//   }
// );

export default router;
