import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './mongo/connectDB';
import institutionsRouter from './api/routes/institutions-router';

dotenv.config();
const app = express();
const PORT = 8084;

app.get('/', (req: Request, res: Response) => {
  res.send({ message: 'Institutions service running' });
});

const corsOpt = {
  origin: '*',
};
app.use(cors(corsOpt));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1/institutions', institutionsRouter);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}`);
  });
});
