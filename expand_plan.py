plan_file = 'docs/superpowers/plans/2026-05-13-phase1-backend-auth.md'

# 读取现有内容并移除最后的 Execution Handoff
with open(plan_file, 'r', encoding='utf-8') as f:
    content = f.read()

# 移除简化版的 Task 3 和 Execution Handoff
content = content.split('## Task 3: User DAO')[0]

# 添加完整的 Task 3-13
additional = '''
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
    if (fs.existsSync(testDbPath)) {
      fs.unlinkSync(testDbPath);
    }
  });

  it('should register a new user', () => {
    const result = authService.register(db, {
      email: 'test@example.com',
      password: 'password123',
      nickname: 'TestUser',
      avatar: '😀',
      bio: 'Test bio'
    });

    expect(result).toBeDefined();
    expect(result.user.email).toBe('test@example.com');
    expect(result.user.nickname).toBe('TestUser');
    expect(result.token).toBeDefined();
    expect(typeof result.token).toBe('string');
  });

  it('should throw error for duplicate email', () => {
    authService.register(db, {
      email: 'test@example.com',
      password: 'password123',
      nickname: 'TestUser'
    });

    expect(() => {
      authService.register(db, {
        email: 'test@example.com',
        password: 'password456',
        nickname: 'AnotherUser'
      });
    }).toThrow('Email already exists');
  });

  it('should login with correct credentials', () => {
    authService.register(db, {
      email: 'test@example.com',
      password: 'password123',
      nickname: 'TestUser'
    });

    const result = authService.login(db, 'test@example.com', 'password123');
    expect(result).toBeDefined();
    expect(result.user.email).toBe('test@example.com');
    expect(result.token).toBeDefined();
  });

  it('should throw error for wrong password', () => {
    authService.register(db, {
      email: 'test@example.com',
      password: 'password123',
      nickname: 'TestUser'
    });

    expect(() => {
      authService.login(db, 'test@example.com', 'wrongpassword');
    }).toThrow('Invalid credentials');
  });

  it('should throw error for non-existent user', () => {
    expect(() => {
      authService.login(db, 'nonexistent@example.com', 'password123');
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
import * as userDAO from '../dao/userDAO'
