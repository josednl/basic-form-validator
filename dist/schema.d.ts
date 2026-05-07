import { Validator } from './validator.js';
import type { ValidationRule } from './types.js';
export declare abstract class SchemaNode<T = any> {
    protected _rules: ValidationRule<any>[];
    protected _isRequired: boolean;
    required(msg?: string): this;
    protected abstract getType(): T;
    buildConfig(path?: string): {
        rules: Record<string, ValidationRule<any>[]>;
    };
    build(): Validator<any>;
}
export declare class StringNode extends SchemaNode<string> {
    protected getType(): string;
    email(): this;
    minLength(min: number): this;
}
export declare class NumberNode extends SchemaNode<number> {
    protected getType(): number;
    constructor();
    min(minValue: number): this;
}
export declare class BooleanNode extends SchemaNode<boolean> {
    protected getType(): boolean;
}
export declare class ObjectNode<T extends Record<string, SchemaNode>> extends SchemaNode<{
    [K in keyof T]: T[K] extends SchemaNode<infer U> ? U : any;
}> {
    private shape;
    constructor(shape: T);
    protected getType(): {
        [K in keyof T]: T[K] extends SchemaNode<infer U> ? U : any;
    };
    buildConfig(path?: string): {
        rules: Record<string, ValidationRule<any>[]>;
    };
}
export declare const s: {
    string: () => StringNode;
    number: () => NumberNode;
    boolean: () => BooleanNode;
    object: <T extends Record<string, SchemaNode>>(shape: T) => ObjectNode<T>;
};
