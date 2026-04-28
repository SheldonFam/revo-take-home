import type { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import { NotFoundError } from '../errors.js';

export const errorMiddleware: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof ZodError) {
    res.status(400).json({
      error: {
        code: 'validation_error',
        message: 'Request failed validation',
        fields: err.issues.map((i) => ({ path: i.path, message: i.message })),
      },
    });
    return;
  }
  if (err instanceof NotFoundError) {
    res.status(404).json({
      error: { code: 'not_found', message: err.message },
    });
    return;
  }
  console.error('[server] unhandled error:', err);
  res.status(500).json({
    error: { code: 'internal_error', message: 'Unexpected error' },
  });
};
