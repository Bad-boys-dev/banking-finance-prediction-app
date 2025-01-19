import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
const app = express();

app.use(express());
app.use(express.urlencoded({ extended: true }));

const corsOptions = {
  origin: '*'
}
app.use(cors(corsOptions));

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to the account service!');
});

const PORT = process.env.PORT ?? 8083;

app.listen(PORT, () => {
  console.log(`Listening on Port ${PORT}`)
});