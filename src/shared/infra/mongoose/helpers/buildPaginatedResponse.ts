import { PaginateResult } from 'mongoose';
import { IPaginatedResponse } from '../../../routes';

export default function buildPaginatedResponse<T>(
  resultsPage: PaginateResult<any>,
): IPaginatedResponse<T> {
  return {
    data: resultsPage.docs.map(o => o.toObject()),
    page: resultsPage.page ?? 1,
    pageSize: resultsPage.limit,
    hasNextPage: resultsPage.hasNextPage,
    hasPreviousPage: resultsPage.hasPrevPage,
    totalPages: resultsPage.totalPages,
    totalResults: resultsPage.totalDocs,
  };
}
