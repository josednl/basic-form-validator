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

  it('should handle boolean and all nodes', async () => {
    const schema = s.object({
      isActive: s.boolean(),
      email: s.string().email(),
      bio: s.string().minLength(10),
      score: s.number().min(0)
    });

    const validator = schema.build();
    
    const result = await validator.validate({ 
      isActive: true, 
      email: 'test@example.com', 
      bio: 'This is a long bio', 
      score: 100 
    });
    expect(result.isValid).toBe(true);

    const invalidResult = await validator.validate({ 
      isActive: 'yes' as any, 
      email: 'not-an-email', 
      bio: 'short', 
      score: -1 
    });
    expect(invalidResult.isValid).toBe(false);
  });
});
