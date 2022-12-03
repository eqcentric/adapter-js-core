import { v4 } from 'uuid';
import { Response, NextFunction, Request } from 'express';

export const requestHandler = (req: Request, res: Response, next: NextFunction) => {
  req.params.requestId = v4();
  next();
};
