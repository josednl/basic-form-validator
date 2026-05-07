import type { Request, Response, NextFunction } from 'express';
import { Validator } from './validator.js';
import type { ValidatorConfig } from './types.js';

export interface MiddlewareOptions {
  /**
   * Source of data to validate. Defaults to 'body'.
   */
  source?: 'body' | 'query' | 'params';
  
  /**
   * Custom error handler. If not provided, sends 400 with errors.
   */
  onError?: (errors: Record<string, string[]>, req: Request, res: Response) => void;
}

/**
 * Creates an Express middleware for validation and sanitization.
 * 
 * @param config Validator configuration (rules, sanitizers, messages)
 * @param options Middleware options
 * @returns Express middleware function
 */
export function validate(config: ValidatorConfig, options: MiddlewareOptions = {}) {
  const validator = new Validator(config);
  const source = options.source || 'body';

  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req[source];
      const result = await validator.validate(data);

      if (!result.isValid) {
        if (options.onError) {
          return options.onError(result.errors, req, res);
        }
        return res.status(400).json({
          status: 'error',
          errors: result.errors
        });
      }

      // Replace data with sanitized version
      req[source] = result.data;
      next();
    } catch (error) {
      next(error);
    }
  };
}
