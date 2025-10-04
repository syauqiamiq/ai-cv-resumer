import { HttpCustomStatus } from '@global/enums/http.enum';
import { IApiErrorResponseContract } from '@global/interfaces/response.interface';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

import { v4 as uuidv4 } from 'uuid';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('REQUEST_ERROR');
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();
    const requestId = uuidv4();

    const errorResponse: IApiErrorResponseContract = {
      status: HttpCustomStatus.ERROR,
      code: status,
      request_meta: {
        timestamp: new Date().toISOString(),
        path: request.url,
        request_id: requestId,
        method: request.method,
      },
      message:
        (typeof exceptionResponse === 'string'
          ? exceptionResponse
          : (exceptionResponse as any).message) || 'Internal server error',
      data: null,
    };
    this.logger.error(JSON.stringify(errorResponse as any));
    response.status(status).json(errorResponse);
  }
}
