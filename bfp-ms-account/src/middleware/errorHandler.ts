import { Request, Response, NextFunction } from 'express';

interface IErrorCode {
  code: string;
  status: number;
}

export default (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const error: any = { ...err };
  error.msg = err.message as string;

  const errorCode = getErrorCode(err);

  return res.status(errorCode.status || 500).json({
    code: errorCode.code,
    msg: error.msg,
  });
};

const getErrorCode = (error: Error) => {
  let errorInfo: IErrorCode = {
    code: 'bfp_00',
    status: 500,
  };

  if (error.constructor.name === 'BadRequest') {
    errorInfo.code = 'bfp_01';
    errorInfo.status = 400;
  } else if (error.constructor.name === 'NotFound') {
    errorInfo.code = 'bfp_02';
    errorInfo.status = 400;
  } else if (error.constructor.name === 'NotAuthorized') {
    errorInfo.code = 'bfp_03';
    errorInfo.status = 401;
  } else if (error.constructor.name === 'UnprocessableContent') {
    errorInfo.code = 'bfp_04';
    errorInfo.status = 422;
  } else {
    errorInfo.code = 'bfp_00'; // Internal Server Error
    errorInfo.status = 500;
  }

  return errorInfo;
};
