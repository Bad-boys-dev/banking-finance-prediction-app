import express, { Request, Response } from 'express';

const app = express()

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to the account service!')
})

const PORT = 8083

app.listen(PORT, () => {
  console.log(`Listening on Port ${PORT}`)
})