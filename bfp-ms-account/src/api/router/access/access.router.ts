import express, { Request, Response, NextFunction } from 'express';
import { service } from '../../../app';

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

export default router;
