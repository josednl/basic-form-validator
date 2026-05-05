import { describe, it, expect } from 'vitest';
import { Validator } from './validator.js';
import { required, email } from './rules.js';

describe('Validator', () => {
  it('should validate correctly based on rules', async () => {
    const validator = new Validator({
      rules: {
        username: [required],
        email: [required, email]
      }
    });

    const result = await validator.validate({
      username: '',
      email: 'invalid'
    });

    expect(result.isValid).toBe(false);
    expect(result.errors.username).toContain('This field is required');
    expect(result.errors.email).toContain('Invalid email format');
  });

  it('should return isValid true when data is valid', async () => {
    const validator = new Validator({
      rules: {
        username: [required],
        email: [required, email]
      }
    });

    const result = await validator.validate({
      username: 'johndoe',
      email: 'john@example.com'
    });

    expect(result.isValid).toBe(true);
    expect(Object.keys(result.errors).length).toBe(0);
  });

  it('should handle async rules', async () => {
    const asyncRule = async (val: any) => {
      await new Promise(resolve => setTimeout(resolve, 10));
      return val === 'taken' ? 'Username already taken' : null;
    };

    const validator = new Validator({
      rules: {
        username: [asyncRule]
      }
    });

    const result = await validator.validate({ username: 'taken' });
    expect(result.isValid).toBe(false);
    expect(result.errors.username).toContain('Username already taken');
  });

  it('should apply sanitizers', async () => {
    const trim = (val: string) => val.trim();
    const toLower = (val: string) => val.toLowerCase();

    const validator = new Validator({
      rules: {
        email: [required]
      },
      sanitizers: {
        email: [trim, toLower]
      }
    });

    const result = await validator.validate({
      email: '  JOHN@Example.com  '
    });

    expect(result.isValid).toBe(true);
    expect(result.data.email).toBe('john@example.com');
  });
});
