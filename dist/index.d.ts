import { Validator } from './validator.js';
import * as rules from './rules.js';
import * as sanitizers from './sanitizers.js';
import { validate as expressMiddleware } from './middleware.js';
import * as sModule from './schema.js';
export declare const s: {
    string: () => sModule.StringNode;
    number: () => sModule.NumberNode;
    boolean: () => sModule.BooleanNode;
    object: <T extends Record<string, sModule.SchemaNode>>(shape: T) => sModule.ObjectNode<T>;
};
export type { StringNode, NumberNode, BooleanNode, ObjectNode } from './schema.js';
export { Validator, rules, sanitizers, expressMiddleware };
export * from './types.js';
