import { describe, it, expect } from 'vitest';
import { s } from './schema.js';

describe('Schema Generator', () => {
  it('should build a validator from a schema', async () => {
    const userSchema = s.object({
      name: s.string().required(),
      age: s.number().min(18)
    });

    const validator = userSchema.build();

    const result = await validator.validate({ name: 'John', age: 20 });
    expect(result.isValid).toBe(true);
    expect(result.data).toEqual({ name: 'John', age: 20 });

    const invalidResult = await validator.validate({ name: '', age: 10 });
    expect(invalidResult.isValid).toBe(false);
  });

  it('should handle nested objects', async () => {
    const schema = s.object({
      user: s.object({
        name: s.string().required()
      })
    });

    const validator = schema.build();
    
    const result = await validator.validate({ user: { name: 'John' } } as any);
    expect(result.isValid).toBe(true);
  });
});
