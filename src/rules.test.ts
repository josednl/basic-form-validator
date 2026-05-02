import { describe, it, expect } from 'vitest';
import { required, email, minLength, isNumber } from './rules.js';

describe('Validation Rules', () => {
  describe('required', () => {
    it('should return error for empty values', () => {
      expect(required('')).toBe('This field is required');
      expect(required(null)).toBe('This field is required');
      expect(required(undefined)).toBe('This field is required');
    });

    it('should return null for non-empty values', () => {
      expect(required('test')).toBeNull();
      expect(required(0)).toBeNull();
      expect(required(false)).toBeNull();
    });
  });

  describe('email', () => {
    it('should return error for invalid emails', () => {
      expect(email('invalid-email')).toBe('Invalid email format');
      expect(email('test@')).toBe('Invalid email format');
      expect(email('@domain.com')).toBe('Invalid email format');
    });

    it('should return null for valid emails', () => {
      expect(email('test@example.com')).toBeNull();
      expect(email('user.name@domain.co.uk')).toBeNull();
    });

    it('should return null for empty values (delegated to required)', () => {
      expect(email('')).toBeNull();
    });
  });

  describe('minLength', () => {
    it('should return error if length is less than min', () => {
      const min3 = minLength(3);
      expect(min3('ab')).toBe('Minimum length is 3 characters');
    });

    it('should return null if length is enough', () => {
      const min3 = minLength(3);
      expect(min3('abc')).toBeNull();
      expect(min3('abcd')).toBeNull();
    });
  });

  describe('isNumber', () => {
    it('should return error for non-numbers', () => {
      expect(isNumber('123')).toBe('Value must be a number');
      expect(isNumber(NaN)).toBe('Value must be a number');
    });

    it('should return null for numbers', () => {
      expect(isNumber(123)).toBeNull();
      expect(isNumber(0)).toBeNull();
      expect(isNumber(-1.5)).toBeNull();
    });
  });
});
