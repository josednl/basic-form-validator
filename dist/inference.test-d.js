import { describe, it, expectTypeOf } from 'vitest';
import { Validator } from './validator.js';
import { required, email, isNumber } from './rules.js';
describe('Type Inference', () => {
    it('should infer basic types from rules', () => {
        const rules = {
            name: [required],
            email: [required, email],
            age: [isNumber]
        };
        const validator = new Validator({ rules });
        expectTypeOf().toEqualTypeOf();
    });
    it('should provide type safety for validate input and output', async () => {
        const validator = new Validator({
            rules: {
                id: [isNumber],
                username: [required]
            }
        });
        // @ts-expect-error - missing required fields
        await validator.validate({ id: 1 }); // Missing username
        const result = await validator.validate({ id: 1, username: 'test' });
        expectTypeOf(result.data).toEqualTypeOf();
        expectTypeOf(result.data.id).toBeNumber();
        expectTypeOf(result.data.username).toBeString();
    });
    it('should infer structure even without explicit interface', async () => {
        const rules = {
            anything: [required]
        };
        const validator = new Validator({ rules });
        const result = await validator.validate({ anything: 'whatever' });
        expectTypeOf(result.data).toHaveProperty('anything');
    });
});
