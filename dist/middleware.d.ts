import type { Request, Response, NextFunction } from 'express';
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
export declare function validate(config: ValidatorConfig, options?: MiddlewareOptions): (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
