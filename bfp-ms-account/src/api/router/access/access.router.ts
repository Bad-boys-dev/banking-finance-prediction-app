import express, { Request, Response, NextFunction } from 'express';
import { service } from '../../../app';
import {
  getAccounts,
  retrieveAccessToken,
} from '../../../goCardless/gocardless';

const router = express.Router();

router.post(
  '/connect',
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      cid,
      body: { institutionId },
    } = req;
    try {
      const response = await service.connectBankAccount(institutionId, cid);

      res.status(200).send({ res: response });
    } catch (err: any) {
      next(err);
    }
  }
);

router.get(
  '/accounts/:requisitionId',
  async (req: Request, res: Response, next: NextFunction) => {
    const { params, cid } = req;
    try {
      const response = await service.retrieveRequisition(
        params.requisitionId,
        cid
      );

      res.status(200).send({ res: response });
    } catch (err: unknown) {
      next(err);
    }
  }
);

router.get(
  '/accounts/:reference',
  async (req: Request, res: Response, next: NextFunction) => {
    const reference = String(req.params.reference);
    try {
      const token = await retrieveAccessToken();

      const accounts = await getAccounts(reference, token.access);

      res.status(200).send({ response: accounts });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
