import { bench, describe } from 'vitest';
import { Validator } from './validator.js';
import { s } from './schema.js';
import * as rules from './rules.js';

describe('Validator Performance', () => {
  // 1. Flat Object
  const flatSchema = s.object({
    name: s.string().required(),
    age: s.number().min(0),
    email: s.string().email(),
    isAdmin: s.boolean()
  });
  const flatValidator = flatSchema.build();
  const flatData = {
    name: 'John Doe',
    age: 30,
    email: 'john@example.com',
    isAdmin: false
  };

  bench('Flat object validation', async () => {
    await flatValidator.validate(flatData);
  });

  // 2. Deeply Nested Object
  const deepSchema = s.object({
    level1: s.object({
      level2: s.object({
        level3: s.object({
          level4: s.object({
            level5: s.string().required()
          })
        })
      })
    })
  });
  const deepValidator = deepSchema.build();
  const deepData = {
    level1: {
      level2: {
        level3: {
          level4: {
            level5: 'deep value'
          }
        }
      }
    }
  };

  bench('Deeply nested object validation (5 levels)', async () => {
    await deepValidator.validate(deepData as any);
  });

  // 3. Large Data Set (using wildcards)
  const listSchema = new Validator({
    rules: {
      'items.*.id': [rules.required, rules.isNumber],
      'items.*.name': [rules.required]
    }
  });
  const largeData = {
    items: Array.from({ length: 100 }, (_, i) => ({
      id: i,
      name: `Item ${i}`
    }))
  };

  bench('Large data set validation (100 items with wildcards)', async () => {
    await listSchema.validate(largeData as any);
  });

  // 4. Async Rules
  const asyncRule = async () => {
    await new Promise(resolve => setTimeout(resolve, 0));
    return null;
  };
  const asyncValidator = new Validator({
    rules: {
      field1: [asyncRule],
      field2: [asyncRule],
      field3: [asyncRule]
    }
  });
  const asyncData = { field1: 'a', field2: 'b', field3: 'c' };

  bench('Async rules (3 parallel rules)', async () => {
    await asyncValidator.validate(asyncData);
  });
});
