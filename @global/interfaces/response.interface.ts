import { HttpCustomStatus } from '../enums/http.enum';
import { IPaginationMeta } from './pagination.interface';

export interface IApiResponse<T> {
  bypassInterceptor?: boolean;
  message?: string;
  meta?: IPaginationMeta;
  data: T;
}

export interface IApiGeneralResponseContract<T> {
  code: number;
  status: string;
  request_meta: {
    request_id: string;
  };
  message: string | any;
  meta: IPaginationMeta;
  data: T;
}

export interface IApiSuccessResponseContract {
  code: number;
  status: string;
  request_meta: {
    request_id: string;
  };
  message: string | any;
  meta: IPaginationMeta;
  data: any;
}
export interface IApiErrorResponseContract {
  status: HttpCustomStatus;
  code: number;
  request_meta: {
    timestamp: string | any;
    path: string | any;
    request_id: string | any;
    method: string | any;
  };
  message: string | any;
  data: any;
}

interface IDataUnprocessable {
  property: string;
  message: string[];
}

export interface IUnprocessableResponse {
  message: string;
  data: Array<IDataUnprocessable>;
}
