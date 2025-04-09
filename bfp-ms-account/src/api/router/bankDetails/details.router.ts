import express, { NextFunction, Request, Response } from 'express';
// import { service } from '../../service/bankDetails/details.service';
import { transactionsSyncSchema, balancesSyncSchema } from '../../schema';
import { validateBody } from '../../../middleware';
import logger from '../../../utils/logger';

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
// router.post(
//   '/transactions/sync',
//   validateBody(transactionsSyncSchema),
//   async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const { accountId } = req.body;
//       const log = logger(req.cid);
//       const resp = await service.saveTransactionsToDB(accountId, log);
//       res.status(200).send({
//         message: `Data ${resp.command} successfully into database!`,
//         count: resp.rowCount,
//       });
//     } catch (err) {
//       next(err);
//     }
//   }
// );

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
//
// router.get('/', async (req: Request, res: Response, next: NextFunction) => {
//   const { cid } = req;
//   try {
//     const log = logger(cid);
//     const response = await service.retrieveBankDataFromDB(log);
//     res.status(200).send({ response });
//   } catch (err) {
//     next(err);
//   }
// });
//
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
