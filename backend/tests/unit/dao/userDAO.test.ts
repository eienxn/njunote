
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import * as userDAO from '../../../src/dao/userDAO';

describe('UserDAO', () => {
  const testDbPath = path.join(__dirname, '../../test-user.db');
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
    if (fs.existsSync(testDbPath)) {
      fs.unlinkSync(testDbPath);
    }
  });

  it('should create a new user', () => {
    const user = userDAO.create(db, {
      email: 'test@example.com',
      password: 'password123',
      nickname: 'TestUser',
      avatar: '😀',
      bio: 'Test bio'
    });

    expect(user).toBeDefined();
    expect(user.id).toBe(1);
    expect(user.email).toBe('test@example.com');
    expect(user.nickname).toBe('TestUser');
  });

  it('should find user by email', () => {
    userDAO.create(db, {
      email: 'test@example.com',
      password: 'password123',
      nickname: 'TestUser'
    });

    const user = userDAO.findByEmail(db, 'test@example.com');
    expect(user).toBeDefined();
    expect(user?.email).toBe('test@example.com');
  });

  it('should find user by id', () => {
    const created = userDAO.create(db, {
      email: 'test@example.com',
      password: 'password123',
      nickname: 'TestUser'
    });

    const user = userDAO.findById(db, created.id);
    expect(user).toBeDefined();
    expect(user?.id).toBe(created.id);
  });

  it('should return null for non-existent email', () => {
    const user = userDAO.findByEmail(db, 'nonexistent@example.com');
    expect(user).toBeNull();
  });
});
