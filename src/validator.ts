import type { 
  ValidationResult, 
  ValidationErrors, 
  ValidatorConfig,
  FieldRules
} from './types.js';

export class Validator {
  private rules: FieldRules;

  constructor(config: ValidatorConfig) {
    this.rules = config.rules;
  }

  validate(data: Record<string, any>): ValidationResult {
    const errors: ValidationErrors = {};
    let isValid = true;

    for (const field in this.rules) {
      const fieldRules = this.rules[field];
      const value = data[field];
      const fieldErrors: string[] = [];

      for (const rule of fieldRules) {
        const error = rule(value, data);
        if (error) {
          fieldErrors.push(error);
        }
      }

      if (fieldErrors.length > 0) {
        errors[field] = fieldErrors;
        isValid = false;
      }
    }

    return {
      isValid,
      errors
    };
  }
}
