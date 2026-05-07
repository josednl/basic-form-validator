import { Validator } from './validator.js';
import * as rules from './rules.js';
export class SchemaNode {
    _rules = [];
    _isRequired = false;
    required(msg) {
        this._isRequired = true;
        this._rules.push(rules.required);
        return this;
    }
    buildConfig(path = '') {
        const config = { rules: {} };
        if (this._rules.length > 0) {
            config.rules[path || 'root'] = this._rules;
        }
        return config;
    }
    build() {
        const config = this.buildConfig();
        return new Validator(config);
    }
}
export class StringNode extends SchemaNode {
    getType() { return ''; }
    email() {
        this._rules.push(rules.email);
        return this;
    }
    minLength(min) {
        this._rules.push(rules.minLength(min));
        return this;
    }
}
export class NumberNode extends SchemaNode {
    getType() { return 0; }
    constructor() {
        super();
        this._rules.push(rules.isNumber);
    }
    min(minValue) {
        this._rules.push(rules.min(minValue));
        return this;
    }
}
export class BooleanNode extends SchemaNode {
    getType() { return false; }
}
export class ObjectNode extends SchemaNode {
    shape;
    constructor(shape) {
        super();
        this.shape = shape;
    }
    getType() {
        return {};
    }
    buildConfig(path = '') {
        const config = { rules: {} };
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
    object: (shape) => new ObjectNode(shape)
};
