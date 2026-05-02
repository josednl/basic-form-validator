export type ValidationRule = (value: any, context?: any) => string | null;

export interface FieldRules {
  [field: string]: ValidationRule[];
}

export interface ValidationErrors {
  [field: string]: string[];
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationErrors;
}

export interface ValidatorConfig {
  rules: FieldRules;
  messages?: {
    [ruleName: string]: string;
  };
}
