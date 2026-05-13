import { describe, it, expect } from 'vitest';
import { generateToken, verifyToken } from '../../../src/utils/jwt';

describe('JWT Utils', () => {
  it('should generate a valid JWT token', () => {
    const payload = { userId: 1, email: 'test@example.com' };
    const token = generateToken(payload);
    expect(token).toBeDefined();
    expect(typeof token).toBe('string');
    expect(token.split('.').length).toBe(3);
  });

  it('should verify a valid token', () => {
    const payload = { userId: 1, email: 'test@example.com' };
    const token = generateToken(payload);
    const decoded = verifyToken(token);
    expect(decoded).toBeDefined();
    expect(decoded.userId).toBe(1);
    expect(decoded.email).toBe('test@example.com');
  });

  it('should throw error for invalid token', () => {
    expect(() => verifyToken('invalid.token.here')).toThrow();
  });
});