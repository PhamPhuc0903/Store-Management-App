export interface ApiErrorResponse {
  code: string;
  message: string;
  requestId?: string;
  retryable: boolean;
  details?: unknown;
  timestamp: string;
  path: string;
}
