import Database from 'better-sqlite3';
import { User, UserCreateInput } from '../types';

export function create(db: Database.Database, input: UserCreateInput): User {
  try {
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

    const user = findById(db, info.lastInsertRowid as number);
    if (!user) {
      throw new Error('Failed to retrieve created user');
    }
    return user;
  } catch (error: any) {
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      throw new Error(`User with email ${input.email} already exists`);
    }
    throw error;
  }
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
