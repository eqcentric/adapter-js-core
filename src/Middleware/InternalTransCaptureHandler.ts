import { NextFunction, Request, Response } from 'express';
import { v4 } from 'uuid';

export const internalTransCaptureHandler = (req: Request, res: Response, next: NextFunction) => {
  const tranId: any = req.header('X-Integration-Trans-Id') || v4();
  const tranEnv: any = req.header('X-Integration-Env') || process.env.APP_ENV;
  req.query.trans = {
    id: tranId,
    env: tranEnv,
  };
  next();
};
