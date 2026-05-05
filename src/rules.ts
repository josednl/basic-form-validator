import type { ValidationRule } from './types.js';

export const required: ValidationRule = (value: any) => {
  if (value === undefined || value === null || value === '') {
    return 'This field is required';
  }
  return null;
};

export const email: ValidationRule = (value: any) => {
  if (!value) return null; // Let 'required' handle empty values
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (typeof value !== 'string' || !emailRegex.test(value)) {
    return 'Invalid email format';
  }
  return null;
};

export const minLength = (min: number): ValidationRule => (value: any) => {
  if (!value) return null;
  if (typeof value !== 'string' || value.length < min) {
    return `Minimum length is ${min} characters`;
  }
  return null;
};

export const isNumber: ValidationRule = (value: any) => {
  if (value === undefined || value === null) return null;
  if (typeof value !== 'number' || isNaN(value)) {
    return 'Value must be a number';
  }
  return null;
};

export const when = (
  condition: (data: any) => boolean | Promise<boolean>,
  rules: ValidationRule[]
): ValidationRule => async (value: any, context?: any) => {
  const shouldRun = await condition(context);
  if (!shouldRun) return null;

  for (const rule of rules) {
    const error = await rule(value, context);
    if (error) return error;
  }
  return null;
};
