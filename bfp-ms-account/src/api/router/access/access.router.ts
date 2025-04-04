import express, { Request, Response, NextFunction } from 'express';
import { service } from '../../service/access/access.service';
import {
  createUserAgreementSchema,
  requisitionsSchema,
  retrieveAccountSchema,
} from '../../schema';
import { validateBody } from '../../../middleware';
import logger from '../../../utils/logger';

const router = express.Router();

router.post(
  '/createUserAgreement',
  validateBody(createUserAgreementSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      institutionId,
      maxHistoricalDays,
      accessValidForDays,
      accessScope,
    } = req.body;

    const cid = req?.cid;

    try {
      const response: object = await service.createUserAgreement(
        institutionId,
        maxHistoricalDays,
        accessValidForDays,
        accessScope,
        cid
      );
      res.status(201).send(response);
    } catch (err: any) {
      next(err);
    }
  }
);

router.post(
  '/requisitions',
  validateBody(requisitionsSchema),
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
  validateBody(retrieveAccountSchema),
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

router.get(
  '/requisitions',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const log = logger(req.cid);
      const response = await service.getRequisitions(log);

      res.status(200).send({ res: response });
    } catch (err: any) {
      next(err);
    }
  }
);

export default router;
