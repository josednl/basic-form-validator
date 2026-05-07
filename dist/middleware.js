import { Validator } from './validator.js';
/**
 * Creates an Express middleware for validation and sanitization.
 *
 * @param config Validator configuration (rules, sanitizers, messages)
 * @param options Middleware options
 * @returns Express middleware function
 */
export function validate(config, options = {}) {
    const validator = new Validator(config);
    const source = options.source || 'body';
    return async (req, res, next) => {
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
        }
        catch (error) {
            next(error);
        }
    };
}
