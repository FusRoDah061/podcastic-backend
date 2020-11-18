import { NextFunction, Request, Response } from 'express';
import AppError from '../errors/AppError';

export default function errorHandler(
  err: Error,
  request: Request,
  response: Response,
  _next: NextFunction,
): Response<any> {
  console.error('Global error handler: ', err);

  if (err instanceof AppError) {
    return response.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  return response.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
}
