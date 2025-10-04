import { HttpCustomStatus } from '@global/enums/http.enum';
import { IApiSuccessResponseContract } from '@global/interfaces/response.interface';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Response } from 'express';
import { map, Observable } from 'rxjs';

import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ApiResponseInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<IApiSuccessResponseContract> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse<Response>();

    const requestId = uuidv4();

    return next.handle().pipe(
      map((data) => {
        if (data?.bypassInterceptor) {
          return data?.data;
        }
        return {
          code: response.statusCode,
          status: HttpCustomStatus.SUCCESS,
          request_meta: {
            request_id: requestId,
          },
          message: data?.message || '',
          meta: data?.meta,
          data: data?.data,
        };
      }),
    );
  }
}
