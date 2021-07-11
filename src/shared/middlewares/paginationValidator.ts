import { NextFunction, Request, Response } from 'express';
import { DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE } from '../routes';

export default function paginationValidator(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  const { page, pageSize } = request.query;

  if (!page) {
    request.query.page = '1';
  }

  if (!pageSize) {
    request.query.pageSize = String(DEFAULT_PAGE_SIZE);
  }

  if (Number(pageSize) > MAX_PAGE_SIZE) {
    request.query.pageSize = String(MAX_PAGE_SIZE);
  }

  return next();
}
