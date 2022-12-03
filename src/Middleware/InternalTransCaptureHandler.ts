import { container } from 'tsyringe';
import { internalTransDto } from '@Dto/InternalDto';
import { Request, Response, NextFunction } from 'express';

export const internalTransCaptureHandler = (req: Request, res: Response, next: NextFunction) => {
  const tranId: any = req.header('X-Integration-Trans-Id');
  const tranEnv: any = req.header('X-Integration-Env');

  container.register('trans', {
    useFactory: (): internalTransDto => {
      return {
        id: tranId,
        env: tranEnv,
      };
    },
  });

  next();
};
