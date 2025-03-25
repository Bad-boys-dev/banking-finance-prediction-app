import express, { Request, Response } from 'express';
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
  try {
    const resp = await service.lookupInstitutions();
    res.status(200).send(resp);
  } catch (err: any) {
    res.status(500).send({ message: err.message });
    console.log(err);
  }
});

export default router;
