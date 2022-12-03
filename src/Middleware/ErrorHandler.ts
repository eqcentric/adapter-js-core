import { ErrorRequestHandler } from 'express';
import { split } from 'lodash';
const debug = require('debug')('datafac:router');

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  debug(err.message, err.stack);
  err.status = err.status || 500;
  res.status(err.status).json({ status: err.status, errors: split(err.message, '. ') });
};
