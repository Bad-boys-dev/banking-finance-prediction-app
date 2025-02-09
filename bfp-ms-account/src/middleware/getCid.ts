import { NextFunction, Request, Response } from 'express';
import { v4 as uuid } from 'uuid';

const getCid = (req: Request, res: Response, next: NextFunction) => {
  req.cid = (req.headers['x-cid'] as string) ?? uuid();
  next();
};

export default getCid;
