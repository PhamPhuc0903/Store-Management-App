export interface ApiErrorResponse {
  code: string;
  message: string;
  requestId?: string;
  retryable: boolean;
  details?: unknown;
  timestamp: string;
  path: string;
}

export interface ApiExceptionBody {
  code?: unknown;
  message?: unknown;
  retryable?: unknown;
  details?: unknown;
}
