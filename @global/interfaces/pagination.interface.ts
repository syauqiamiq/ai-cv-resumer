import { OrderDirectionType } from '@global/enums/pagination.enum';

export interface ISortRequest {
  sort?: string;
  order?: OrderDirectionType;
}

export interface IPaginateRequest {
  perPage?: number;
  page?: number;
}

// Index Response

export interface IPaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface IPaginateResponse<T> {
  meta: IPaginationMeta;
  data: Array<T>;
}
