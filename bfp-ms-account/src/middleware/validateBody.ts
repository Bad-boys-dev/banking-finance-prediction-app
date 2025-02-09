import { ZodError, ZodObject } from 'zod';
import { Request, Response, NextFunction } from 'express';
import { v4 as uuid } from 'uuid';
import { BadRequest } from '../errors';
import logger from '../utils/logger';

const validateBody =
  (schema: ZodObject<any>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({ body: req.body, params: req.params });
      next();
    } catch (err: any) {
      if (err instanceof ZodError) {
        const errMsg = err?.errors.map(error => error.message);
        logger(uuid()).error('Failed to create user agreement');
        throw new BadRequest(`${errMsg?.join('')}`);
      } else {
        throw new Error('Internal Server Error');
      }
    }
  };

export default validateBody;
