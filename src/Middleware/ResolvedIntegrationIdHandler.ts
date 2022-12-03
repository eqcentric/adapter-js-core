import { container } from 'tsyringe';
import { Request, Response, NextFunction } from 'express';

export const resolvedIntegrationIdHandler = (req: Request, res: Response, next: NextFunction) => {
  container.register('integrationId', {
    useFactory: (): number => {
      return parseInt(req.params.integrationId) || 0;
    },
  });

  next();
};
