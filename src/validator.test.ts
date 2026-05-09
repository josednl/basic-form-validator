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

  it('should apply all built-in sanitizers', async () => {
    const { trim, toLowerCase, toUpperCase, toNumber, escape } = await import('./sanitizers.js');
    
    const validator = new Validator({
      rules: {},
      sanitizers: {
        t: [trim],
        lc: [toLowerCase],
        uc: [toUpperCase],
        num: [toNumber],
        esc: [escape],
        ignored: [trim] // Test with non-string
      }
    });

    const result = await validator.validate({
      t: '  trim me  ',
      lc: 'LOWER',
      uc: 'upper',
      num: '123.45',
      esc: '<script>alert("xss")</script>',
      ignored: 123
    } as any);

    expect(result.data.t).toBe('trim me');
    expect(result.data.lc).toBe('lower');
    expect(result.data.uc).toBe('UPPER');
    expect(result.data.num).toBe(123.45);
    expect(result.data.esc).toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;&#x2F;script&gt;');
    expect(result.data.ignored).toBe(123);
  });
});
