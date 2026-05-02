import { describe, it, expect } from 'vitest';
import { Validator } from './validator.js';
import { required, email } from './rules.js';

describe('Validator', () => {
  it('should validate correctly based on rules', () => {
    const validator = new Validator({
      rules: {
        username: [required],
        email: [required, email]
      }
    });

    const result = validator.validate({
      username: '',
      email: 'invalid'
    });

    expect(result.isValid).toBe(false);
    expect(result.errors.username).toContain('This field is required');
    expect(result.errors.email).toContain('Invalid email format');
  });

  it('should return isValid true when data is valid', () => {
    const validator = new Validator({
      rules: {
        username: [required],
        email: [required, email]
      }
    });

    const result = validator.validate({
      username: 'johndoe',
      email: 'john@example.com'
    });

    expect(result.isValid).toBe(true);
    expect(Object.keys(result.errors).length).toBe(0);
  });
});
