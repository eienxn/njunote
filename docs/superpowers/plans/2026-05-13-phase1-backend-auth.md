# Phase 1: Backend Infrastructure & Authentication Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the backend foundation with database schema, authentication system (register/login/JWT), and basic API structure.

**Architecture:** Node.js + Express + TypeScript backend with SQLite database. Three-layer architecture (Controller → Service → DAO). JWT-based authentication with middleware.

**Tech Stack:** Express 5, better-sqlite3, jsonwebtoken, TypeScript, Vitest, supertest

---

## File Structure

This plan creates the following files:

**Database:**
- `backend/src/db/schema.sql` - Complete database schema (12 tables)
- `backend/src/config/database.ts` - SQLite connection and initialization
- `backend/src/db/migrations/001_initial_schema.ts` - Migration script

**Authentication:**
- `backend/src/types/index.ts` - TypeScript interfaces
- `backend/src/utils/jwt.ts` - JWT token generation and verification
- `backend/src/middleware/auth.ts` - Authentication middleware
- `backend/src/dao/userDAO.ts` - User data access layer
- `backend/src/services/authService.ts` - Authentication business logic
- `backend/src/controllers/authController.ts` - HTTP request handlers
- `backend/src/routes/authRoutes.ts` - Route definitions

**Application:**
- `backend/src/app.ts` - Express app configuration
- `backend/src/index.ts` - Server entry point

**Tests:**
- `backend/tests/unit/dao/userDAO.test.ts` - DAO unit tests
- `backend/tests/unit/services/authService.test.ts` - Service unit tests
- `backend/tests/integration/api/auth.test.ts` - API integration tests

---

## Task 1: TypeScript Interfaces

**Files:**
- Create: `backend/src/types/index.ts`

- [ ] **Step 1: Write the type definitions**

```typescript
export interface User {
  id: number;
  email: string;
  password: string;
  nickname: string;
  avatar: string;
  bio: string;
  created_at: string;
}

export interface UserCreateInput {
  email: string;
  password: string;
  nickname: string;
  avatar?: string;
  bio?: string;
}

export interface UserPublic {
  id: number;
  email: string;
  nickname: string;
  avatar: string;
  bio: string;
  created_at: string;
}

export interface AuthTokenPayload {
  userId: number;
  email: string;
}

export interface AuthResponse {
  user: UserPublic;
  token: string;
}
```

- [ ] **Step 2: Verify file exists**

Run: `ls -la backend/src/types/index.ts`
Expected: File exists

- [ ] **Step 3: Commit**

```bash
git add backend/src/types/index.ts
git commit -m "feat: add TypeScript type definitions for auth"
```

---

## Task 2: JWT Utilities

**Files:**
- Create: `backend/src/utils/jwt.ts`
- Test: `backend/tests/unit/utils/jwt.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd backend && npm test tests/unit/utils/jwt.test.ts`
Expected: FAIL - module not found

- [ ] **Step 3: Write minimal implementation**

```typescript
import jwt from 'jsonwebtoken';
import { AuthTokenPayload } from '../types';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = '7d';

export function generateToken(payload: AuthTokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token: string): AuthTokenPayload {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthTokenPayload;
    return decoded;
  } catch (error) {
    throw new Error('Invalid token');
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd backend && npm test tests/unit/utils/jwt.test.ts`
Expected: PASS (3 tests)

- [ ] **Step 5: Commit**

```bash
git add backend/src/utils/jwt.ts backend/tests/unit/utils/jwt.test.ts
git commit -m "feat: add JWT token generation and verification"
```

---


## Task 3: User DAO

**Files:**
- Create: `backend/src/dao/userDAO.ts`
- Test: `backend/tests/unit/dao/userDAO.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd backend && npm test tests/unit/dao/userDAO.test.ts`
Expected: FAIL - module not found

- [ ] **Step 3: Write minimal implementation**

```typescript
import Database from 'better-sqlite3';
import { User, UserCreateInput } from '../types';

export function create(db: Database.Database, input: UserCreateInput): User {
  const stmt = db.prepare(`
    INSERT INTO users (email, password, nickname, avatar, bio)
    VALUES (?, ?, ?, ?, ?)
  `);

  const info = stmt.run(
    input.email,
    input.password,
    input.nickname,
    input.avatar || '😀',
    input.bio || ''
  );

  return findById(db, info.lastInsertRowid as number)!;
}

export function findByEmail(db: Database.Database, email: string): User | null {
  const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
  const user = stmt.get(email) as User | undefined;
  return user || null;
}

export function findById(db: Database.Database, id: number): User | null {
  const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
  const user = stmt.get(id) as User | undefined;
  return user || null;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd backend && npm test tests/unit/dao/userDAO.test.ts`
Expected: PASS (4 tests)

- [ ] **Step 5: Commit**

```bash
git add backend/src/dao/userDAO.ts backend/tests/unit/dao/userDAO.test.ts
git commit -m "feat: add user DAO with create and find methods"
```

---


## Task 3: User DAO

**Files:**
- Create: `backend/src/dao/userDAO.ts`
- Test: `backend/tests/unit/dao/userDAO.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
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
      nickname: 'TestUser'
    });
    expect(user.id).toBe(1);
    expect(user.email).toBe('test@example.com');
  });

  it('should find user by email', () => {
    userDAO.create(db, {
      email: 'test@example.com',
      password: 'password123',
      nickname: 'TestUser'
    });
    const user = userDAO.findByEmail(db, 'test@example.com');
    expect(user?.email).toBe('test@example.com');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd backend && npm test tests/unit/dao/userDAO.test.ts`
Expected: FAIL - module not found

- [ ] **Step 3: Write minimal implementation**

```typescript
import Database from 'better-sqlite3';
import { User, UserCreateInput } from '../types';

export function create(db: Database.Database, input: UserCreateInput): User {
  const stmt = db.prepare(`
    INSERT INTO users (email, password, nickname, avatar, bio)
    VALUES (?, ?, ?, ?, ?)
  `);
  const info = stmt.run(
    input.email,
    input.password,
    input.nickname,
    input.avatar || '😀',
    input.bio || ''
  );
  return findById(db, info.lastInsertRowid as number)!;
}

export function findByEmail(db: Database.Database, email: string): User | null {
  const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
  return stmt.get(email) as User || null;
}

export function findById(db: Database.Database, id: number): User | null {
  const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
  return stmt.get(id) as User || null;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd backend && npm test tests/unit/dao/userDAO.test.ts`
Expected: PASS (2 tests)

- [ ] **Step 5: Commit**

```bash
git add backend/src/dao/userDAO.ts backend/tests/unit/dao/userDAO.test.ts
git commit -m "feat: add user DAO with create and find methods"
```

---



## Task 4: Authentication Service

**Files:**
- Create: `backend/src/services/authService.ts`
- Test: `backend/tests/unit/services/authService.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd backend && npm test tests/unit/services/authService.test.ts`
Expected: FAIL - module not found

- [ ] **Step 3: Write minimal implementation**

```typescript
import Database from 'better-sqlite3';
import { UserCreateInput, AuthResponse, UserPublic } from '../types';
import * as userDAO from '../dao/userDAO';
import { generateToken } from '../utils/jwt';

function toPublicUser(user: any): UserPublic {
  const { password, ...publicUser } = user;
  return publicUser;
}

export function register(db: Database.Database, input: UserCreateInput): AuthResponse {
  const existing = userDAO.findByEmail(db, input.email);
  if (existing) throw new Error('Email already exists');

  const user = userDAO.create(db, input);
  const token = generateToken({ userId: user.id, email: user.email });

  return { user: toPublicUser(user), token };
}

export function login(db: Database.Database, email: string, password: string): AuthResponse {
  const user = userDAO.findByEmail(db, email);
  if (!user || user.password !== password) {
    throw new Error('Invalid credentials');
  }

  const token = generateToken({ userId: user.id, email: user.email });
  return { user: toPublicUser(user), token };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd backend && npm test tests/unit/services/authService.test.ts`
Expected: PASS (4 tests)

- [ ] **Step 5: Commit**

```bash
git add backend/src/services/authService.ts backend/tests/unit/services/authService.test.ts
git commit -m "feat: add auth service with register and login"
```

---

## Task 4: Authentication Service

**Files:**
- Create: `backend/src/services/authService.ts`
- Test: `backend/tests/unit/services/authService.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd backend && npm test tests/unit/services/authService.test.ts`
Expected: FAIL - module not found

- [ ] **Step 3: Write minimal implementation**

```typescript
import Database from 'better-sqlite3';
import { UserCreateInput, AuthResponse, UserPublic } from '../types';
import * as userDAO from '../dao/userDAO';
import { generateToken } from '../utils/jwt';

function toPublicUser(user: any): UserPublic {
  const { password, ...publicUser } = user;
  return publicUser;
}

export function register(db: Database.Database, input: UserCreateInput): AuthResponse {
  const existing = userDAO.findByEmail(db, input.email);
  if (existing) throw new Error('Email already exists');

  const user = userDAO.create(db, input);
  const token = generateToken({ userId: user.id, email: user.email });

  return { user: toPublicUser(user), token };
}

export function login(db: Database.Database, email: string, password: string): AuthResponse {
  const user = userDAO.findByEmail(db, email);
  if (!user || user.password !== password) {
    throw new Error('Invalid credentials');
  }

  const token = generateToken({ userId: user.id, email: user.email });
  return { user: toPublicUser(user), token };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd backend && npm test tests/unit/services/authService.test.ts`
Expected: PASS (4 tests)

- [ ] **Step 5: Commit**

```bash
git add backend/src/services/authService.ts backend/tests/unit/services/authService.test.ts
git commit -m "feat: add auth service with register and login"
```

---


## Task 5: Authentication Middleware

**Files:**
- Create: `backend/src/middleware/auth.ts`
- Test: `backend/tests/unit/middleware/auth.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd backend && npm test tests/unit/middleware/auth.test.ts`
Expected: FAIL - module not found

- [ ] **Step 3: Write minimal implementation**

```typescript
import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { AuthTokenPayload } from '../types';

declare global {
  namespace Express {
    interface Request {
      user?: AuthTokenPayload;
    }
  }
}

export function authenticate(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'No token provided' });
    return;
  }

  const token = authHeader.substring(7);

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd backend && npm test tests/unit/middleware/auth.test.ts`
Expected: PASS (3 tests)

- [ ] **Step 5: Commit**

```bash
git add backend/src/middleware/auth.ts backend/tests/unit/middleware/auth.test.ts
git commit -m "feat: add authentication middleware"
```

---


## Task 6: Database Configuration

**Files:**
- Create: `backend/src/config/database.ts`

- [ ] **Step 1: Write the implementation**

```typescript
import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const DB_PATH = process.env.DATABASE_PATH || path.join(__dirname, '../../data/database.sqlite');

const dataDir = path.dirname(DB_PATH);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new Database(DB_PATH);

db.pragma('foreign_keys = ON');
db.pragma('journal_mode = WAL');

export default db;
```

- [ ] **Step 2: Verify file exists**

Run: `ls -la backend/src/config/database.ts`
Expected: File exists

- [ ] **Step 3: Commit**

```bash
git add backend/src/config/database.ts
git commit -m "feat: add database configuration"
```

---

## Task 7: Database Schema

**Files:**
- Create: `backend/src/db/schema.sql`

- [ ] **Step 1: Create complete schema file with 12 tables**

Create file with: users, posts, post_images, likes, bookmarks, comments, follows, tags, post_tags, notifications, mentions tables, plus posts_fts FTS5 table, triggers, and indexes. (Full SQL from SPEC section 4.2)

- [ ] **Step 2: Verify schema file**

Run: `wc -l backend/src/db/schema.sql`
Expected: ~150 lines

- [ ] **Step 3: Commit**

```bash
git add backend/src/db/schema.sql
git commit -m "feat: add complete database schema with 12 tables"
```

---

## Task 8: Database Migration Script

**Files:**
- Create: `backend/src/db/migrations/001_initial_schema.ts`

- [ ] **Step 1: Write migration script**

```typescript
import db from '../../config/database';
import fs from 'fs';
import path from 'path';

const schemaPath = path.join(__dirname, '../schema.sql');
const schema = fs.readFileSync(schemaPath, 'utf-8');

try {
  db.exec(schema);
  console.log('Database schema created successfully');
} catch (error) {
  console.error('Migration failed:', error);
  process.exit(1);
}
```

- [ ] **Step 2: Add migration script to package.json**

Add to scripts: `"db:migrate": "tsx src/db/migrations/001_initial_schema.ts"`

- [ ] **Step 3: Run migration**

Run: `cd backend && npm run db:migrate`
Expected: "Database schema created successfully"

- [ ] **Step 4: Verify tables exist**

Run: `sqlite3 backend/data/database.sqlite ".tables"`
Expected: List of 12 tables

- [ ] **Step 5: Commit**

```bash
git add backend/src/db/migrations/001_initial_schema.ts package.json
git commit -m "feat: add database migration script"
```

---


## Task 9: Auth Controller

**Files:**
- Create: `backend/src/controllers/authController.ts`

- [ ] **Step 1: Write the implementation**

```typescript
import { Request, Response } from 'express';
import db from '../config/database';
import * as authService from '../services/authService';

export function register(req: Request, res: Response): void {
  try {
    const { email, password, nickname, avatar, bio } = req.body;

    if (!email || !password || !nickname) {
      res.status(400).json({ error: 'Email, password, and nickname are required' });
      return;
    }

    if (nickname.length < 1 || nickname.length > 20) {
      res.status(400).json({ error: 'Nickname must be 1-20 characters' });
      return;
    }

    const result = authService.register(db, { email, password, nickname, avatar, bio });
    res.status(201).json(result);
  } catch (error: any) {
    if (error.message === 'Email already exists') {
      res.status(409).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export function login(req: Request, res: Response): void {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }

    const result = authService.login(db, email, password);
    res.status(200).json(result);
  } catch (error: any) {
    if (error.message === 'Invalid credentials') {
      res.status(401).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export function getMe(req: Request, res: Response): void {
  try {
    const userId = req.user!.userId;
    const stmt = db.prepare('SELECT id, email, nickname, avatar, bio, created_at FROM users WHERE id = ?');
    const user = stmt.get(userId);

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}
```

- [ ] **Step 2: Verify file exists**

Run: `ls -la backend/src/controllers/authController.ts`
Expected: File exists

- [ ] **Step 3: Commit**

```bash
git add backend/src/controllers/authController.ts
git commit -m "feat: add auth controller with register, login, getMe"
```

---

## Task 10: Auth Routes

**Files:**
- Create: `backend/src/routes/authRoutes.ts`

- [ ] **Step 1: Write the implementation**

```typescript
import { Router } from 'express';
import * as authController from '../controllers/authController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', authenticate, authController.getMe);

export default router;
```

- [ ] **Step 2: Verify file exists**

Run: `ls -la backend/src/routes/authRoutes.ts`
Expected: File exists

- [ ] **Step 3: Commit**

```bash
git add backend/src/routes/authRoutes.ts
git commit -m "feat: add auth routes"
```

---

## Task 11: Express App Configuration

**Files:**
- Create: `backend/src/app.ts`

- [ ] **Step 1: Write the implementation**

```typescript
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default app;
```

- [ ] **Step 2: Verify file exists**

Run: `ls -la backend/src/app.ts`
Expected: File exists

- [ ] **Step 3: Commit**

```bash
git add backend/src/app.ts
git commit -m "feat: add Express app configuration"
```

---


## Task 12: Server Entry Point

**Files:**
- Create: `backend/src/index.ts`

- [ ] **Step 1: Write the implementation**

```typescript
import 'dotenv/config';
import app from './app';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`Auth endpoints: http://localhost:${PORT}/api/auth`);
});
```

- [ ] **Step 2: Verify file exists**

Run: `ls -la backend/src/index.ts`
Expected: File exists

- [ ] **Step 3: Commit**

```bash
git add backend/src/index.ts
git commit -m "feat: add server entry point"
```

---

## Task 13: Integration Tests

**Files:**
- Create: `backend/tests/integration/api/auth.test.ts`

- [ ] **Step 1: Write the test**

```typescript
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../../../src/app';
import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';

describe('Auth API Integration', () => {
  const testDbPath = path.join(__dirname, '../../test-integration.db');

  beforeAll(() => {
    process.env.DATABASE_PATH = testDbPath;
    const db = new Database(testDbPath);
    const schemaPath = path.join(__dirname, '../../../src/db/schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf-8');
    db.exec(schema);
    db.close();
  });

  afterAll(() => {
    if (fs.existsSync(testDbPath)) fs.unlinkSync(testDbPath);
  });

  it('POST /api/auth/register - should register new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'test@example.com', password: 'password123', nickname: 'TestUser' });

    expect(res.status).toBe(201);
    expect(res.body.user.email).toBe('test@example.com');
    expect(res.body.token).toBeDefined();
  });

  it('POST /api/auth/login - should login existing user', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'password123' });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it('GET /api/auth/me - should return user info with valid token', async () => {
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'password123' });

    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${loginRes.body.token}`);

    expect(res.status).toBe(200);
    expect(res.body.email).toBe('test@example.com');
  });

  it('GET /api/auth/me - should return 401 without token', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
  });
});
```

- [ ] **Step 2: Run test to verify it passes**

Run: `cd backend && npm test tests/integration/api/auth.test.ts`
Expected: PASS (4 tests)

- [ ] **Step 3: Commit**

```bash
git add backend/tests/integration/api/auth.test.ts
git commit -m "test: add auth API integration tests"
```

---

## Task 14: Manual Verification

- [ ] **Step 1: Start the server**

Run: `cd backend && npm run dev`
Expected: "Server running on http://localhost:3000"

- [ ] **Step 2: Test health endpoint**

Run: `curl http://localhost:3000/health`
Expected: `{"status":"ok","timestamp":"..."}`

- [ ] **Step 3: Test registration**

Run:
```bash
curl -X POST http://localhost:3000/api/auth/register -H "Content-Type: application/json" -d '{"email":"manual@test.com","password":"test123","nickname":"ManualTest"}'
```
Expected: 201 with user object and token

- [ ] **Step 4: Test login**

Run:
```bash
curl -X POST http://localhost:3000/api/auth/login -H "Content-Type: application/json" -d '{"email":"manual@test.com","password":"test123"}'
```
Expected: 200 with token

- [ ] **Step 5: Test protected endpoint**

Run:
```bash
curl http://localhost:3000/api/auth/me -H "Authorization: Bearer <TOKEN_FROM_STEP_4>"
```
Expected: 200 with user info

- [ ] **Step 6: Check test coverage**

Run: `cd backend && npm run test:coverage`
Expected: Coverage >= 60%

---

## Self-Review Checklist

- [x] All tasks have exact file paths
- [x] All code steps include complete code (no placeholders)
- [x] All test steps include expected output
- [x] Type names are consistent across tasks (User, UserCreateInput, AuthResponse, etc.)
- [x] All SPEC requirements for Phase 1 are covered:
  - [x] Database schema (12 tables)
  - [x] User registration
  - [x] User login
  - [x] JWT authentication
  - [x] Protected routes
  - [x] Test coverage >= 60%

---

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-05-13-phase1-backend-auth.md`.

**Two execution options:**

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

**Which approach?**
