import type { ValidationResult, ValidatorConfig } from './types.js';
export declare class Validator<T extends Record<string, any> = any> {
    private rules;
    private sanitizers;
    private messages;
    constructor(config: ValidatorConfig<T>);
    private resolveErrorMessage;
    validate(data: T): Promise<ValidationResult<T>>;
}
