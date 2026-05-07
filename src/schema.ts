import { Validator } from './validator.js';
import * as rules from './rules.js';
import type { ValidatorConfig, FieldRules, ValidationRule } from './types.js';

export abstract class SchemaNode<T = any> {
  protected _rules: ValidationRule<any>[] = [];
  protected _isRequired = false;

  required(msg?: string) {
    this._isRequired = true;
    this._rules.push(rules.required);
    return this;
  }

  protected abstract getType(): T;

  buildConfig(path = ''): { rules: Record<string, ValidationRule<any>[]> } {
    const config: { rules: Record<string, ValidationRule<any>[]> } = { rules: {} };
    if (this._rules.length > 0) {
      config.rules[path || 'root'] = this._rules;
    }
    return config;
  }

  build(): Validator<any> {
    const config = this.buildConfig();
    return new Validator(config as any);
  }
}

export class StringNode extends SchemaNode<string> {
  protected getType(): string { return ''; }

  email() {
    this._rules.push(rules.email);
    return this;
  }

  minLength(min: number) {
    this._rules.push(rules.minLength(min));
    return this;
  }
}

export class NumberNode extends SchemaNode<number> {
  protected getType(): number { return 0; }

  constructor() {
    super();
    this._rules.push(rules.isNumber);
  }

  min(minValue: number) {
    this._rules.push(rules.min(minValue));
    return this;
  }
}

export class BooleanNode extends SchemaNode<boolean> {
  protected getType(): boolean { return false; }
}

export class ObjectNode<T extends Record<string, SchemaNode>> extends SchemaNode<{
  [K in keyof T]: T[K] extends SchemaNode<infer U> ? U : any
}> {
  constructor(private shape: T) {
    super();
  }

  protected getType(): { [K in keyof T]: T[K] extends SchemaNode<infer U> ? U : any } {
    return {} as any;
  }

  buildConfig(path = ''): { rules: Record<string, ValidationRule<any>[]> } {
    const config: { rules: Record<string, ValidationRule<any>[]> } = { rules: {} };
    
    for (const key in this.shape) {
      const childPath = path ? `${path}.${key}` : key;
      const childConfig = this.shape[key].buildConfig(childPath);
      Object.assign(config.rules, childConfig.rules);
    }

    return config;
  }
}

export const s = {
  string: () => new StringNode(),
  number: () => new NumberNode(),
  boolean: () => new BooleanNode(),
  object: <T extends Record<string, SchemaNode>>(shape: T) => new ObjectNode(shape)
};
