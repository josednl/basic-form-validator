import { describe, it, expect } from 'vitest';
import * as rules from './rules.js';
import * as utils from './utils.js';
import * as sanitizers from './sanitizers.js';
import { s } from './schema.js';

describe('Coverage Booster', () => {
  it('hits missing branches in rules', async () => {
    // email with non-string
    expect(rules.email(123 as any)).toEqual({ key: 'email' });
    
    // minLength with non-string/array
    expect(rules.minLength(5)(123 as any)).toEqual({ key: 'minLength', params: { min: 5 } });
    
    // min with non-number
    expect(rules.min(10)('abc' as any)).toEqual({ key: 'min', params: { min: 10 } });

    // when condition false
    const conditional = rules.when(() => false, [rules.required]);
    expect(await conditional('val', {})).toBeNull();
  });

  it('hits missing branches in utils', () => {
    // getDeepValue undefined path
    expect(utils.getDeepValue({ a: 1 }, 'b.c')).toBeUndefined();
    
    // setDeepValue creating path
    const obj: any = {};
    utils.setDeepValue(obj, 'a.b.c', 1);
    expect(obj.a.b.c).toBe(1);

    // expandPaths without data for wildcard
    expect(utils.expandPaths({}, 'items.*.id')).toEqual([]);
  });

  it('hits missing branches in sanitizers', () => {
    expect(sanitizers.toNumber('not-a-number')).toBe('not-a-number');
    expect(sanitizers.escape(123 as any)).toBe(123);
  });

  it('hits missing functions in schema', () => {
    const str = s.string();
    expect((str as any).getType()).toBe('');
    
    const num = s.number();
    expect((num as any).getType()).toBe(0);
    
    const bool = s.boolean();
    expect((bool as any).getType()).toBe(false);
    
    const obj = s.object({});
    expect((obj as any).getType()).toEqual({});
  });
});
