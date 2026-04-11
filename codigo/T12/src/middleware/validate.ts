// src/middleware/validate.ts
// Middleware de validación con Zod

import { Request, Response, NextFunction } from 'express';
import { z, ZodSchema, ZodError } from 'zod';

type ValidationTarget = 'body' | 'query' | 'params';

// Middleware genérico de validación
export const validate = <T extends ZodSchema>(
  schema: T,
  target: ValidationTarget = 'body'
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const data = schema.parse(req[target]);
      req[target] = data;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          success: false,
          error: 'Validation error',
          details: error.errors.map(e => ({
            field: e.path.join('.'),
            message: e.message
          }))
        });
        return;
      }
      next(error);
    }
  };
};

// Validar múltiples targets
export const validateRequest = <
  TBody extends ZodSchema = ZodSchema,
  TQuery extends ZodSchema = ZodSchema,
  TParams extends ZodSchema = ZodSchema
>(schemas: {
  body?: TBody;
  query?: TQuery;
  params?: TParams;
}) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      if (schemas.body) {
        req.body = schemas.body.parse(req.body);
      }
      if (schemas.query) {
        req.query = schemas.query.parse(req.query);
      }
      if (schemas.params) {
        req.params = schemas.params.parse(req.params) as typeof req.params;
      }
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          success: false,
          error: 'Validation error',
          details: error.errors
        });
        return;
      }
      next(error);
    }
  };
};
