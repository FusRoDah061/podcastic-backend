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
      statusCode: err.statusCode,
      error: err.error,
      message: err.message,
    });
  }

  return response.status(500).json({
    status: 500,
    error: 'Internal server error',
    message: 'An unexpected error ocurred while processing the request.',
  });
}
