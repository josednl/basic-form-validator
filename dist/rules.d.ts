import type { ValidationRule } from './types.js';
export declare const required: ValidationRule<any>;
export declare const email: ValidationRule<string>;
export declare const minLength: (min: number) => ValidationRule<string | any[]>;
export declare const isNumber: ValidationRule<number>;
export declare const min: (minValue: number) => ValidationRule<number>;
export declare const when: (condition: (data: any) => boolean | Promise<boolean>, rules: ValidationRule<any>[]) => ValidationRule<any>;
