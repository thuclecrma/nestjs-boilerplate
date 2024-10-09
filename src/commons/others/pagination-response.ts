import { Response } from './response';

export interface IPagination {
  page: number;
  limit: number;
  total: number;
}

export class PaginationResponse<T> extends Response<T[]> {
  data: T[];
  message: string;
  pagination: IPagination;

  constructor(data: T[], pagination: IPagination, message = 'Success') {
    super(data, message);
    this.pagination = pagination;
  }
}

export default PaginationResponse;
