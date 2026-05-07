import { Validator } from './validator.js';
import * as rules from './rules.js';
import * as sanitizers from './sanitizers.js';
import { validate as expressMiddleware } from './middleware.js';
import * as sModule from './schema.js';
export const s = sModule.s;
export { Validator, rules, sanitizers, expressMiddleware };
export * from './types.js';
// CLI entry point is now moved to src/cli.ts
