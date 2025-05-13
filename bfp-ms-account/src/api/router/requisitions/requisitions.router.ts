import express, { Request, Response, NextFunction } from 'express';
import { getAccounts, lookupRequisitions, deleteRequisition, retrieveAccessToken } from '../../../goCardless/gocardless';
import logger from '../../../utils/logger';

const router = express.Router();

router.get('/', async (req: Request, res: Response, next: NextFunction)  => {
  const { cid } = req;
  try {
    const { access: accessToken } = await retrieveAccessToken();
    logger(cid).info('Access token fetched...')

    const response = await lookupRequisitions(accessToken);
    res.status(200).send({ response });
  } catch(err: any) {
    next(err);
  }
})

router.get('/:id', async (req: Request, res: Response, next: NextFunction)  => {
  const cid = req.cid as string;
  const id = req.params.id as string;

  try {
    const { access: accessToken } = await retrieveAccessToken();
    logger(cid).info('Access token fetched...')

    const response = await getAccounts(id, accessToken);
    res.status(200).send({ response });
  } catch(err: any) {
    next(err);
  }
})

router.delete('/:id', async (req: Request, res: Response, next: NextFunction)  => {
  const cid = req.cid as string;
  const id = req.params.id as string;

  try {
    const { access: accessToken } = await retrieveAccessToken();
    logger(cid).info('Access token fetched...')
    const response = await deleteRequisition(id, accessToken);

    res.status(200).send({ result: response });
  } catch(err: any) {
    next(err);
  }
})

export default router;