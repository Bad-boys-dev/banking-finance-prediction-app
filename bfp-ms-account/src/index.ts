import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';
import cors from 'cors';
import dotenv from 'dotenv';
import detailsRouter from './api/router/bankDetails/details.router';
import accessRouter from './api/router/access/access.router';
import { ErrorHandler, retrieveCid } from './middleware';
import logger from './utils/logger';

dotenv.config();
const app = express();

const corsOptions = {
  origin: '*',
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(retrieveCid);
app.use(express.urlencoded({ extended: true }));

app.use((req: Request, res: Response, next: NextFunction) => {
  logger().info(`Incoming Request: ${req.method} ${req.url}`);
  next();
});

app.use('/api/v1/details', detailsRouter);
app.use('/api/v1/access', accessRouter);

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to the account service!');
});

//@ts-ignore
app.use(ErrorHandler);

const PORT = process.env.PORT ?? 8083;

app.listen(PORT, () => {
  // console.log(`Listening on Port ${PORT}`);
  logger().info(`Listening on Port ${PORT}`);
});
