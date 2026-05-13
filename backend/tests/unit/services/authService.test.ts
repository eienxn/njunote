import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import * as authService from '../../../src/services/authService';

describe('AuthService', () => {
  const testDbPath = path.join(__dirname, '../../test-auth.db');
  let db: Database.Database;

  beforeEach(() => {
    db = new Database(testDbPath);
    db.pragma('foreign_keys = ON');
    db.exec(`
      CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        nickname TEXT NOT NULL,
        avatar TEXT NOT NULL DEFAULT '😀',
        bio TEXT DEFAULT '',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
  });

  afterEach(() => {
    db.close();
    if (fs.existsSync(testDbPath)) fs.unlinkSync(testDbPath);
  });

  it('should register a new user', () => {
    const result = authService.register(db, {
      email: 'test@example.com',
      password: 'password123',
      nickname: 'TestUser'
    });
    expect(result.user.email).toBe('test@example.com');
    expect(result.token).toBeDefined();
  });

  it('should throw error for duplicate email', () => {
    authService.register(db, { email: 'test@example.com', password: 'pass', nickname: 'Test' });
    expect(() => {
      authService.register(db, { email: 'test@example.com', password: 'pass2', nickname: 'Test2' });
    }).toThrow('Email already exists');
  });

  it('should login with correct credentials', () => {
    authService.register(db, { email: 'test@example.com', password: 'password123', nickname: 'Test' });
    const result = authService.login(db, 'test@example.com', 'password123');
    expect(result.user.email).toBe('test@example.com');
  });

  it('should throw error for wrong password', () => {
    authService.register(db, { email: 'test@example.com', password: 'password123', nickname: 'Test' });
    expect(() => {
      authService.login(db, 'test@example.com', 'wrongpassword');
    }).toThrow('Invalid credentials');
  });
});
