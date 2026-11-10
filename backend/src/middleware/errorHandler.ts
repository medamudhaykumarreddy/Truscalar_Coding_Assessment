import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../services/faculty.service.ts';

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) {
  console.error(`[Error] ${req.method} ${req.originalUrl}:`, err);

  // 1. Zod Validation Errors
  if (err instanceof ZodError) {
    const formattedErrors = err.issues.map((issue) => ({
      path: issue.path.join('.'),
      message: issue.message,
    }));
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: formattedErrors,
    });
  }

  // 2. Application Domain Errors (AppError)
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.message,
      details: err.details,
    });
  }

  // 3. PostgreSQL Specific Database Errors
  if (err.code) {
    // 23505: Unique constraint violation
    if (err.code === '23505') {
      return res.status(409).json({
        success: false,
        error: 'A record with this unique identifier or email already exists in PostgreSQL.',
        details: err.detail,
      });
    }
    // 23503: Foreign key violation
    if (err.code === '23503') {
      return res.status(400).json({
        success: false,
        error: 'Referenced department or parent entity does not exist.',
        details: err.detail,
      });
    }
    // 22P02: Invalid text representation (e.g. invalid UUID format)
    if (err.code === '22P02') {
      return res.status(400).json({
        success: false,
        error: 'Invalid parameter syntax (e.g., malformed UUID).',
      });
    }
  }

  // 4. Fallback Generic 500 Server Error
  return res.status(500).json({
    success: false,
    error: 'Internal Server Error',
    message: err.message || 'An unexpected error occurred on the server.',
  });
}
