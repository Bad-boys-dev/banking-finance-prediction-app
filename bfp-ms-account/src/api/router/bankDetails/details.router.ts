import express, { NextFunction, Request, Response } from 'express';
import { service } from '../../service/bankDetails/details.service';
import { transactionsSyncSchema, balancesSyncSchema } from '../../schema';
import { validateBody } from '../../../middleware';

const router = express.Router();

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const resp = await service.saveBankDetails();
    res.status(200).send({
      message: `Data ${resp.command} successfully into database!`,
      count: resp.rowCount,
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
      const resp = await service.saveTransactionsToDB(accountId);
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
    try {
      const { accountId } = req.body;
      const resp = await service.saveBalancesToDB(accountId);
      res.status(200).send({
        message: `Data ${resp.command} successfully into database!`,
        count: resp.rowCount,
      });
    } catch (err) {
      next(err);
    }
  }
);

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await service.retrieveBankDataFromDB();
    res.status(200).send({ response });
  } catch (err) {
    next(err);
  }
});

export default router;
