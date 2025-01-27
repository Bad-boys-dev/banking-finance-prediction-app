import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import detailsRouter from './api/router/bankDetails/details.router';
import accessRouter from './api/router/access/access.router';

dotenv.config();
const app = express();

const corsOptions = {
  origin: '*',
};
app.use(cors(corsOptions));

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to the account service!');
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1/details', detailsRouter);
app.use('/api/v1/access', accessRouter);

const PORT = process.env.PORT ?? 8083;

app.listen(PORT, () => {
  console.log(`Listening on Port ${PORT}`);
});
