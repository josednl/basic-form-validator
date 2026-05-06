import { describe, it, expect } from 'vitest';
import { Validator } from './validator.js';

describe('i18n Support', () => {
  it('should use default English messages', async () => {
    const config = {
      rules: {
        name: [(v: any) => v ? null : { key: 'required' }],
        age: [(v: any) => v >= 18 ? null : { key: 'minLength', params: { min: 18 } }]
      }
    };
    const validator = new Validator(config as any);
    const result = await validator.validate({ name: '', age: 16 });

    expect(result.isValid).toBe(false);
    expect(result.errors.name).toContain('This field is required');
    expect(result.errors.age).toContain('Minimum length is 18 characters');
  });

  it('should support custom messages (Spanish)', async () => {
    const config = {
      rules: {
        name: [(v: any) => v ? null : { key: 'required' }]
      },
      messages: {
        'required': 'Este campo es obligatorio'
      }
    };
    const validator = new Validator(config as any);
    const result = await validator.validate({ name: '' });

    expect(result.isValid).toBe(false);
    expect(result.errors.name).toContain('Este campo es obligatorio');
  });

  it('should format messages with parameters', async () => {
    const config = {
      rules: {
        count: [(v: any) => ({ key: 'custom', params: { val: v } })]
      },
      messages: {
        'custom': 'Value is {val}'
      }
    };
    const validator = new Validator(config as any);
    const result = await validator.validate({ count: 42 });

    expect(result.errors.count).toContain('Value is 42');
  });
});
