import {
  ArgumentsHost,
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { describe, expect, it, vi } from 'vitest';
import { Request } from 'express';
import { HttpExceptionFilter } from './http-exception.filter';

interface FilterHarness {
  host: ArgumentsHost;
  json: ReturnType<typeof vi.fn>;
  status: ReturnType<typeof vi.fn>;
}

function createHarness(): FilterHarness {
  const json = vi.fn();
  const status = vi.fn(() => ({ json }));
  const request = {
    id: 'request-123',
    originalUrl: '/api/v1/example',
  } as Request;
  const response = { status } as unknown as Response;
  const host = {
    switchToHttp: () => ({
      getRequest: () => request,
      getResponse: () => response,
    }),
  } as ArgumentsHost;
  return { host, json, status };
}

describe('HttpExceptionFilter', () => {
  it('does not expose an unexpected internal error message', () => {
    const filter = new HttpExceptionFilter();
    const harness = createHarness();
    filter.catch(new Error('database password leaked here'), harness.host);
    expect(harness.status).toHaveBeenCalledWith(500);
    expect(harness.json).toHaveBeenCalledWith(
      expect.objectContaining({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Unexpected server error',
        requestId: 'request-123',
        retryable: true,
        path: '/api/v1/example',
      }),
    );
    expect(JSON.stringify(harness.json.mock.calls)).not.toContain('database password leaked here');
  });
  it('does not expose messages from explicit 5xx HTTP exceptions', () => {
    const filter = new HttpExceptionFilter();
    const harness = createHarness();
    filter.catch(new InternalServerErrorException('sensitive dependency details'), harness.host);
    expect(harness.status).toHaveBeenCalledWith(500);
    expect(harness.json).toHaveBeenCalledWith(
      expect.objectContaining({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Unexpected server error',
        retryable: true,
      }),
    );
  });
  it('preserves stable application error metadata for safe 4xx responses', () => {
    const filter = new HttpExceptionFilter();
    const harness = createHarness();
    filter.catch(
      new ConflictException({
        code: 'OPERATION_ID_REUSED',
        message: 'The operation id was already used for a different command.',
        retryable: false,
        details: { field: 'operationId' },
      }),
      harness.host,
    );
    expect(harness.status).toHaveBeenCalledWith(409);
    expect(harness.json).toHaveBeenCalledWith(
      expect.objectContaining({
        code: 'OPERATION_ID_REUSED',
        message: 'The operation id was already used for a different command.',
        retryable: false,
        details: { field: 'operationId' },
      }),
    );
  });
  it('preserves safe validation messages from HTTP exceptions', () => {
    const filter = new HttpExceptionFilter();
    const harness = createHarness();
    filter.catch(
      new BadRequestException({ message: ['name is required', 'name is invalid'] }),
      harness.host,
    );
    expect(harness.status).toHaveBeenCalledWith(400);
    expect(harness.json).toHaveBeenCalledWith(
      expect.objectContaining({
        code: 'HTTP_400',
        message: 'name is required; name is invalid',
        retryable: false,
      }),
    );
  });
});
