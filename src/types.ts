export interface ValidationError {
  key: string;
  params?: Record<string, any>;
}

export type ValidationRuleResult = string | ValidationError | null;

export type ValidationRule = (
  value: any, 
  context?: any
) => ValidationRuleResult | Promise<ValidationRuleResult>;

export type SanitizerRule = (value: any, context?: any) => any | Promise<any>;

export interface FieldRules {
  [field: string]: ValidationRule[];
}

export interface FieldSanitizers {
  [field: string]: SanitizerRule[];
}

export interface ValidationErrors {
  [field: string]: string[];
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationErrors;
  data: any;
}

export interface ValidatorConfig {
  rules: FieldRules;
  sanitizers?: FieldSanitizers;
  messages?: Record<string, string>;
}
