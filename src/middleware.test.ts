import { describe, it, expect, vi } from 'vitest';
import { validate } from './middleware.js';
import { required, email } from './rules.js';
import { trim } from './sanitizers.js';

describe('Express Middleware', () => {
  it('should call next() if validation passes', async () => {
    const middleware = validate({
      rules: { name: [required] }
    });

    const req = { body: { name: 'John' } } as any;
    const res = { status: vi.fn().mockReturnThis(), json: vi.fn() } as any;
    const next = vi.fn();

    await middleware(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('should send 400 and errors if validation fails', async () => {
    const middleware = validate({
      rules: { email: [required, email] }
    });

    const req = { body: { email: 'invalid-email' } } as any;
    const res = { status: vi.fn().mockReturnThis(), json: vi.fn() } as any;
    const next = vi.fn();

    await middleware(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      status: 'error',
      errors: expect.any(Object)
    }));
  });

  it('should sanitize data in request object', async () => {
    const middleware = validate({
      rules: {},
      sanitizers: { name: [trim] }
    });

    const req = { body: { name: '  John  ' } } as any;
    const res = { status: vi.fn().mockReturnThis(), json: vi.fn() } as any;
    const next = vi.fn();

    await middleware(req, res, next);

    expect(req.body.name).toBe('John');
    expect(next).toHaveBeenCalled();
  });

  it('should validate from query parameters if configured', async () => {
    const middleware = validate(
      { rules: { search: [required] } },
      { source: 'query' }
    );

    const req = { query: { search: '' } } as any;
    const res = { status: vi.fn().mockReturnThis(), json: vi.fn() } as any;
    const next = vi.fn();

    await middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(next).not.toHaveBeenCalled();
  });

  it('should use custom error handler if provided', async () => {
    const onError = vi.fn();
    const middleware = validate(
      { rules: { field: [required] } },
      { onError }
    );

    const req = { body: { field: '' } } as any;
    const res = {} as any;
    const next = vi.fn();

    await middleware(req, res, next);

    expect(onError).toHaveBeenCalledWith(
      expect.objectContaining({ field: expect.any(Array) }),
      req,
      res
    );
    expect(next).not.toHaveBeenCalled();
  });
});
