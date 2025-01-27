import express, { Request, Response } from 'express';
import { service } from '../../service/bankDetails/details.service';

const router = express.Router();

router.post('/', async (req: Request, res: Response) => {
  const resp = await service.saveBankDetails();
  console.log('Save Details');
  res.status(200).send({
    message: `Data ${resp.command} successfully into database!`,
    count: resp.rowCount,
  });
});

router.post('/transactions/sync', async (req: Request, res: Response) => {
  const { accountId } = req.body;

  const resp = await service.saveTransactionsToDB(accountId);
  console.log('Save Details');
  res.status(200).send({
    message: `Data ${resp.command} successfully into database!`,
    count: resp.rowCount,
  });
});

router.get('/', async (req: Request, res: Response) => {
  const response = await service.retrieveBankDataFromDB();
  res.status(200).send({ response });
});

export default router;
