import type { ApiErrorCode } from '@revolab/shared';

export class ApiError extends Error {
  readonly code: ApiErrorCode;
  readonly status: number;
  readonly fields?: { path: (string | number)[]; message: string }[];

  constructor(
    message: string,
    code: ApiErrorCode,
    status: number,
    fields?: { path: (string | number)[]; message: string }[],
  ) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
    if (fields !== undefined) this.fields = fields;
  }
}
