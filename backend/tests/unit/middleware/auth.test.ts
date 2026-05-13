import { describe, it, expect, vi } from 'vitest';
import { authenticate } from '../../../src/middleware/auth';
import { generateToken } from '../../../src/utils/jwt';

describe('Auth Middleware', () => {
  it('should call next() with valid token', () => {
    const token = generateToken({ userId: 1, email: 'test@example.com' });
    const req: any = { headers: { authorization: `Bearer ${token}` } };
    const res: any = {};
    const next = vi.fn();

    authenticate(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.user).toBeDefined();
    expect(req.user.userId).toBe(1);
  });

  it('should return 401 without token', () => {
    const req: any = { headers: {} };
    const res: any = { status: vi.fn().mockReturnThis(), json: vi.fn() };
    const next = vi.fn();

    authenticate(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 401 with invalid token', () => {
    const req: any = { headers: { authorization: 'Bearer invalid.token' } };
    const res: any = { status: vi.fn().mockReturnThis(), json: vi.fn() };
    const next = vi.fn();

    authenticate(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
  });
});
