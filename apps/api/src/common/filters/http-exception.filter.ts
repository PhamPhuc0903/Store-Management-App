import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { ApiErrorResponse, ApiExceptionBody } from '../types/api-error-response';
import type { Request, Response } from 'express';

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
    if (status >= HttpStatus.INTERNAL_SERVER_ERROR) {
      const stack = exception instanceof Error ? exception.stack : undefined;
      this.logger.error('Server request exception', stack);
    }
    const structuredBody = this.getStructuredBody(exceptionResponse);
    const isServerError = status >= HttpStatus.INTERNAL_SERVER_ERROR;
    const payload: ApiErrorResponse = {
      code: isServerError
        ? (structuredBody?.code ?? 'INTERNAL_SERVER_ERROR')
        : (structuredBody?.code ?? `HTTP_${status}`),
      message: isServerError ? 'Unexpected server error' : this.getHttpMessage(exceptionResponse),
      requestId: request.id ? String(request.id) : undefined,
      retryable: isServerError
        ? (structuredBody?.retryable ?? true)
        : (structuredBody?.retryable ?? false),
      ...(!isServerError && structuredBody?.details !== undefined
        ? { details: structuredBody.details }
        : {}),
      timestamp: new Date().toISOString(),
      path: request.originalUrl,
    };
    response.status(status).json(payload);
  }

  private getStructuredBody(
    exceptionResponse: string | object | undefined,
  ): { code?: string; retryable?: boolean; details?: unknown } | undefined {
    if (typeof exceptionResponse !== 'object' || exceptionResponse === null) {
      return undefined;
    }
    const body = exceptionResponse as ApiExceptionBody;
    return {
      ...(typeof body.code === 'string' ? { code: body.code } : {}),
      ...(typeof body.retryable === 'boolean' ? { retryable: body.retryable } : {}),
      ...(body.details !== undefined ? { details: body.details } : {}),
    };
  }

  private getHttpMessage(exceptionResponse: string | object | undefined): string {
    if (typeof exceptionResponse === 'string') {
      return exceptionResponse;
    }
    if (
      typeof exceptionResponse === 'object' &&
      exceptionResponse !== null &&
      'message' in exceptionResponse
    ) {
      return this.normalizeMessage(exceptionResponse.message);
    }
    return 'Request failed';
  }

  private normalizeMessage(message: unknown): string {
    if (Array.isArray(message)) {
      return message.map(String).join('; ');
    }
    return String(message);
  }
}
