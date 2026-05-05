export type ValidationRule = (value: any, context?: any) => string | null | Promise<string | null>;
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
  messages?: {
    [ruleName: string]: string;
  };
}
