import { describe, it, expect } from 'vitest';
import { Validator } from './validator.js';
import { required, when } from './rules.js';
import * as sanitizers from './sanitizers.js';

describe('Advanced Validation Features', () => {
  describe('Sanitizers', () => {
    it('should apply multiple sanitizers correctly', async () => {
      const validator = new Validator({
        rules: {},
        sanitizers: {
          name: [sanitizers.trim, sanitizers.toUpperCase],
          age: [sanitizers.toNumber],
          bio: [sanitizers.escape]
        }
      });

      const result = await validator.validate({
        name: '  john doe  ',
        age: '25',
        bio: '<script>alert("xss")</script>'
      });

      expect(result.data.name).toBe('JOHN DOE');
      expect(result.data.age).toBe(25);
      expect(result.data.bio).toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;&#x2F;script&gt;');
    });
  });

  describe('Conditional Rules (when)', () => {
    it('should apply rules only when condition is met', async () => {
      const validator = new Validator({
        rules: {
          reason: [
            when(data => data.isLate === true, [required])
          ]
        }
      });

      // Case 1: isLate is false, reason is not required
      const result1 = await validator.validate({ isLate: false, reason: '' });
      expect(result1.isValid).toBe(true);

      // Case 2: isLate is true, reason is required
      const result2 = await validator.validate({ isLate: true, reason: '' });
      expect(result2.isValid).toBe(false);
      expect(result2.errors.reason).toContain('This field is required');
    });

    it('should support async conditions in when', async () => {
      const asyncCondition = async (data: any) => {
        await new Promise(resolve => setTimeout(resolve, 10));
        return data.check === true;
      };

      const validator = new Validator({
        rules: {
          secret: [when(asyncCondition, [required])]
        }
      });

      const result = await validator.validate({ check: true, secret: '' });
      expect(result.isValid).toBe(false);
      expect(result.errors.secret).toContain('This field is required');
    });
  });
});
