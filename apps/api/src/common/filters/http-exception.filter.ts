import {ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger} from "@nestjs/common";
import type {ApiErrorResponse} from "../types/api-error-response";
import type {Request, Response} from 'express';


@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);
  catch(exception: unknown, host: ArgumentsHost): void {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<Request>();
    const isHttpException = exception instanceof HttpException;
    const status = isHttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const exceptionResponse = isHttpException ? exception.getResponse() : undefined;
    if(status >= HttpStatus.INTERNAL_SERVER_ERROR) {
      const stack = exception instanceof Error ? exception.stack : undefined;
      this.logger.error('Server request exception', stack);
    }
    const payload: ApiErrorResponse = {
      code: status === HttpStatus.INTERNAL_SERVER_ERROR ? 'INTERNAL_SERVER_ERROR' : `HTTP_${status}`,
      message: status >= HttpStatus.INTERNAL_SERVER_ERROR ? 'Unexpected server error' : this.getHttpMessage(exceptionResponse),
      requestId: request.id? String(request.id) : undefined,
      retryable: status >= 500,
      timestamp: new Date().toISOString(),
      path: request.originalUrl,
    };
    response.status(status).json(payload);
  }

  private getHttpMessage(exceptionResponse: string | object | undefined): string {
    if(typeof exceptionResponse === 'string') {
      return exceptionResponse;
    }
    if(typeof exceptionResponse === 'object' && exceptionResponse !== null && 'message' in exceptionResponse) {
      return this.normalizeMessage(exceptionResponse.message);
    }
    return 'Request failed';
  }

  private normalizeMessage(message: unknown): string {
    if(Array.isArray(message)) {
      return message.map(String).join('; ');
    }
    return String(message);
  }
}
