import express, { NextFunction, Request, Response } from 'express';
import { service } from '../../index';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
  const { text } = req.query;
  try {
    const resp = await service.searchInstitutionsByName(text);
    res.status(200).send(resp);
  } catch (err: any) {
    res.status(500).send({ message: err.message });
    console.log(err);
  }
});

router.get('/all', async (req: Request, res: Response) => {
  const page = Number(req.query.page);
  const limit = Number(req.query.limit);
  try {
    const resp = await service.lookupInstitutions(page, limit);
    res.status(200).send(resp);
  } catch (err: any) {
    res.status(500).send({ message: err.message });
    console.log(err);
  }
});

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id as string;
  try {
    const response = await service.getInstitutionById(id);
    res.status(200).send({ response });
  } catch (err: any) {
    next(err);
  }
});

export default router;
