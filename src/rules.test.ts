import { describe, it, expect } from 'vitest';
import { required, email, minLength, isNumber } from './rules.js';

describe('Validation Rules', () => {
  describe('required', () => {
    it('should return error for empty values', () => {
      expect(required('')).toEqual({ key: 'required' });
      expect(required(null)).toEqual({ key: 'required' });
      expect(required(undefined)).toEqual({ key: 'required' });
    });

    it('should return null for non-empty values', () => {
      expect(required('test')).toBeNull();
      expect(required(0)).toBeNull();
      expect(required(false)).toBeNull();
    });
  });

  describe('email', () => {
    it('should return error for invalid emails', () => {
      expect(email('invalid-email')).toEqual({ key: 'email' });
      expect(email('test@')).toEqual({ key: 'email' });
      expect(email('@domain.com')).toEqual({ key: 'email' });
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
      expect(min3('ab')).toEqual({ key: 'minLength', params: { min: 3 } });
    });

    it('should return null if length is enough', () => {
      const min3 = minLength(3);
      expect(min3('abc')).toBeNull();
      expect(min3('abcd')).toBeNull();
    });
  });

  describe('isNumber', () => {
    it('should return error for non-numbers', () => {
      expect(isNumber('123' as any)).toEqual({ key: 'isNumber' });
      expect(isNumber(NaN)).toEqual({ key: 'isNumber' });
    });

    it('should return null for numbers', () => {
      expect(isNumber(123)).toBeNull();
      expect(isNumber(0)).toBeNull();
      expect(isNumber(-1.5)).toBeNull();
    });
  });
});
