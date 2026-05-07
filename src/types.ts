export interface ValidationError {
  key: string;
  params?: Record<string, any>;
}

export type ValidationRuleResult = string | ValidationError | null;

export type ValidationRule<T = any> = (
  value: T, 
  context?: any
) => ValidationRuleResult | Promise<ValidationRuleResult>;

export type SanitizerRule<T = any> = (value: T, context?: any) => T | Promise<T>;

export type FieldRules<T = any> = {
  [K in keyof T]?: ValidationRule<T[K]>[];
} & {
  [key: string]: ValidationRule<any>[] | undefined 
};

export type FieldSanitizers<T = any> = {
  [K in keyof T]?: SanitizerRule<T[K]>[];
} & {
  [key: string]: SanitizerRule<any>[] | undefined;
};

export interface ValidationErrors {
  [field: string]: string[];
}

export interface ValidationResult<T = any> {
  isValid: boolean;
  errors: ValidationErrors;
  data: T;
}

export interface ValidatorConfig<T = any> {
  rules: FieldRules<T>;
  sanitizers?: FieldSanitizers<T>;
  messages?: Record<string, string>;
}

export type InferType<R> = R extends FieldRules<infer T> ? T : any;
