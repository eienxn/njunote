
import Database from 'better-sqlite3';
import { Like, LikeCreateInput } from '../types.js';

export function createLike(db: Database.Database, input: LikeCreateInput): Like {
  const stmt = db.prepare(
    'INSERT INTO likes (userId, postId) VALUES (?, ?)'
  );
  const info = stmt.run(input.userId, input.postId);
  const like = db.prepare('SELECT * FROM likes WHERE id = ?').get(info.lastInsertRowid) as Like;
  if (!like) {
    throw new Error('Failed to create like');
  }
  return like;
}

export function deleteLike(db: Database.Database, id: number): void {
  const stmt = db.prepare('DELETE FROM likes WHERE id = ?');
  stmt.run(id);
}

export function findLikesByPostId(db: Database.Database, postId: number): Like[] {
  const stmt = db.prepare('SELECT * FROM likes WHERE postId = ?');
  return stmt.all(postId) as Like[];
}

export function findLikesByUserId(db: Database.Database, userId: number): Like[] {
  const stmt = db.prepare('SELECT * FROM likes WHERE userId = ?');
  return stmt.all(userId) as Like[];
}

export function findLike(db: Database.Database, userId: number, postId: number): Like | undefined {
  const stmt = db.prepare('SELECT * FROM likes WHERE userId = ? AND postId = ?');
  return stmt.get(userId, postId) as Like | undefined;
}

export function getLikesByNoteId(db: Database.Database, postId: number): Like[] {
  const stmt = db.prepare('SELECT * FROM likes WHERE postId = ?');
  return stmt.all(postId) as Like[];
}

export function getLikeCountByNoteId(db: Database.Database, postId: number): number {
  const stmt = db.prepare('SELECT COUNT(*) as count FROM likes WHERE postId = ?');
  const result = stmt.get(postId) as { count: number };
  return result.count;
}

// Export as object for easier mocking in tests
export const likeDAO = {
  createLike,
  deleteLike,
  findLikesByPostId,
  findLikesByUserId,
  findLike,
  getLikesByNoteId,
  getLikeCountByNoteId
};
