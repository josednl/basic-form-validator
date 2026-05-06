import type { ValidationRule } from './types.js';

export const required: ValidationRule<any> = (value: any) => {
  if (value === undefined || value === null || value === '') {
    return { key: 'required' };
  }
  return null;
};

export const email: ValidationRule<string> = (value: any) => {
  if (!value) return null; // Let 'required' handle empty values
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (typeof value !== 'string' || !emailRegex.test(value)) {
    return { key: 'email' };
  }
  return null;
};

export const minLength = (min: number): ValidationRule<string | any[]> => (value: any) => {
  if (!value) return null;
  if ((typeof value !== 'string' && !Array.isArray(value)) || value.length < min) {
    return { key: 'minLength', params: { min } };
  }
  return null;
};

export const isNumber: ValidationRule<number> = (value: any) => {
  if (value === undefined || value === null) return null;
  if (typeof value !== 'number' || isNaN(value)) {
    return { key: 'isNumber' };
  }
  return null;
};

export const when = (
  condition: (data: any) => boolean | Promise<boolean>,
  rules: ValidationRule<any>[]
): ValidationRule<any> => async (value: any, context?: any) => {
  const shouldRun = await condition(context);
  if (!shouldRun) return null;

  for (const rule of rules) {
    const error = await rule(value, context);
    if (error) return error;
  }
  return null;
};
