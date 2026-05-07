import { describe, it, expect } from 'vitest';
import { Validator } from './validator.js';
import { required, email } from './rules.js';

describe('Nested Structures', () => {
  it('should validate deep objects', async () => {
    const validator = new Validator({
      rules: {
        'user.profile.name': [required],
        'user.email': [required, email]
      }
    });

    const result = await validator.validate({
      user: {
        profile: { name: '' },
        email: 'invalid'
      }
    } as any);

    expect(result.isValid).toBe(false);
    expect(result.errors['user.profile.name']).toContain('This field is required');
    expect(result.errors['user.email']).toContain('Invalid email format');
  });

  it('should validate arrays with wildcards', async () => {
    const validator = new Validator({
      rules: {
        'items.*.id': [required],
        'items.*.email': [email]
      }
    });

    const result = await validator.validate({
      items: [
        { id: 1, email: 'valid@example.com' },
        { id: null, email: 'invalid' }
      ]
    } as any);

    expect(result.isValid).toBe(false);
    expect(result.errors['items.1.id']).toContain('This field is required');
    expect(result.errors['items.1.email']).toContain('Invalid email format');
    expect(result.errors['items.0.id']).toBeUndefined();
  });

  it('should sanitize nested data', async () => {
    const trim = (val: string) => val.trim();
    const validator = new Validator({
      rules: {},
      sanitizers: {
        'user.name': [trim],
        'items.*.name': [trim]
      }
    });

    const result = await validator.validate({
      user: { name: '  John  ' },
      items: [
        { name: '  Item 1  ' },
        { name: '  Item 2  ' }
      ]
    } as any);

    expect((result.data as any).user.name).toBe('John');
    expect((result.data as any).items[0].name).toBe('Item 1');
    expect((result.data as any).items[1].name).toBe('Item 2');
  });
});
