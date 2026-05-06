import type { 
  ValidationResult, 
  ValidationErrors, 
  ValidatorConfig,
  FieldRules,
  FieldSanitizers,
  ValidationRuleResult
} from './types.js';
import { getDeepValue, setDeepValue, expandPaths } from './utils.js';
import { defaultMessages, formatMessage } from './messages.js';

export class Validator {
  private rules: FieldRules;
  private sanitizers: FieldSanitizers;
  private messages: Record<string, string>;

  constructor(config: ValidatorConfig) {
    this.rules = config.rules;
    this.sanitizers = config.sanitizers || {};
    this.messages = { ...defaultMessages, ...(config.messages || {}) };
  }

  private resolveErrorMessage(result: ValidationRuleResult): string {
    if (typeof result === 'string') return result;
    if (result && typeof result === 'object' && 'key' in result) {
      const template = this.messages[result.key] || result.key;
      return formatMessage(template, result.params);
    }
    return 'Invalid value';
  }

  async validate(data: Record<string, any>): Promise<ValidationResult> {
    const errors: ValidationErrors = {};
    let isValid = true;
    const validatedData = JSON.parse(JSON.stringify(data)); // Deep clone

    // 1. Sanitization
    for (const pattern in this.sanitizers) {
      const paths = expandPaths(validatedData, pattern);
      const fieldSanitizers = this.sanitizers[pattern];
      
      for (const path of paths) {
        let value = getDeepValue(validatedData, path);
        for (const sanitizer of fieldSanitizers) {
          value = await sanitizer(value, validatedData);
        }
        setDeepValue(validatedData, path, value);
      }
    }

    // 2. Validation
    const allFieldPaths: { path: string, pattern: string }[] = [];
    for (const pattern in this.rules) {
      const paths = expandPaths(validatedData, pattern);
      paths.forEach(path => allFieldPaths.push({ path, pattern }));
    }

    const fieldPromises = allFieldPaths.map(async ({ path, pattern }) => {
      const fieldRules = this.rules[pattern];
      const value = getDeepValue(validatedData, path);
      const fieldErrors: string[] = [];

      for (const rule of fieldRules) {
        const errorResult = await rule(value, validatedData);
        if (errorResult) {
          fieldErrors.push(this.resolveErrorMessage(errorResult));
        }
      }

      if (fieldErrors.length > 0) {
        return { path, errors: fieldErrors };
      }
      return null;
    });

    const results = await Promise.all(fieldPromises);

    for (const result of results) {
      if (result) {
        errors[result.path] = result.errors;
        isValid = false;
      }
    }

    return {
      isValid,
      errors,
      data: validatedData
    };
  }
}
