import type { Database } from 'better-sqlite3';

export const createFollow = async (db: Database, followerId: number, followingId: number) => {
  const stmt = db.prepare('INSERT INTO follows (followerId, followingId) VALUES (?, ?)');
  const result = stmt.run(followerId, followingId);
  return result.lastInsertRowid;
};

export const deleteFollow = async (db: Database, id: number) => {
  const stmt = db.prepare('DELETE FROM follows WHERE id = ?');
  return stmt.run(id);
};

export const findFollow = async (db: Database, followerId: number, followingId: number) => {
  const stmt = db.prepare('SELECT * FROM follows WHERE followerId = ? AND followingId = ?');
  return stmt.get(followerId, followingId);
};

export const findFollowers = async (db: Database, userId: number) => {
  const stmt = db.prepare('SELECT * FROM follows WHERE followingId = ?');
  return stmt.all(userId);
};

export const findFollowing = async (db: Database, userId: number) => {
  const stmt = db.prepare('SELECT * FROM follows WHERE followerId = ?');
  return stmt.all(userId);
};
