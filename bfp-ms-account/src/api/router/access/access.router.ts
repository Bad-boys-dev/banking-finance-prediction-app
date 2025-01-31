import express, { Request, Response, NextFunction } from 'express';
import { service } from '../../service/access/access.service';

const router = express.Router();

router.post(
  '/createUserAgreement',
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      institutionId,
      maxHistoricalDays,
      accessValidForDays,
      accessScope,
    } = req.body;

    try {
      const response: object = await service.createUserAgreement(
        institutionId,
        maxHistoricalDays,
        accessValidForDays,
        accessScope
      );
      res.status(201).send(response);
    } catch (err: any) {
      next(err);
    }
  }
);

router.post(
  '/requisitions',
  async (req: Request, res: Response, next: NextFunction) => {
    const { institutionId, agreementId } = req.body;
    try {
      res
        .status(201)
        .send(await service.createRequisition(institutionId, agreementId));
    } catch (err: any) {
      next(err);
    }
  }
);

router.get(
  '/accounts/:requisitionId',
  async (req: Request, res: Response, next: NextFunction) => {
    const { requisitionId } = req.params;
    try {
      const response = await service.getRequisitionAccounts(requisitionId);
      res.status(200).send(response);
    } catch (err: any) {
      next(err);
    }
  }
);

export default router;
