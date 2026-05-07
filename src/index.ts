import { Validator } from './validator.js';
import * as rules from './rules.js';
import * as sanitizers from './sanitizers.js';
import { validate as expressMiddleware } from './middleware.js';
import * as s from './schema.js';

export { Validator, rules, sanitizers, expressMiddleware, s };
export * from './types.js';

// CLI entry point is now moved to src/cli.ts
