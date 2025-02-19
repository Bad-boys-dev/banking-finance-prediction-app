import { NextFunction, Request, Response } from 'express';
import { v4 as uuid } from 'uuid';
import getCid from './getCid';

let req: Partial<Request>;
let res: Partial<Response>;
let next: NextFunction;
describe('getCid fn test', () => {
  beforeEach(() => {
    res = {};
  });
  it('should pass cid into request', () => {
    req = { headers: { 'x-cid': 'def-456' } };
    next = jest.fn();

    getCid(req as Request, res as Response, next as NextFunction);
    expect(next).toHaveBeenCalledTimes(1);
    expect(req.cid).toBe('def-456');
  });
});
