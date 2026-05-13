import type { Database } from 'better-sqlite3';

export const createComment = async (db: Database, postId: number, userId: number, content: string) => {
  const stmt = db.prepare('INSERT INTO comments (postId, userId, content) VALUES (?, ?, ?)');
  const result = stmt.run(postId, userId, content);
  return result.lastInsertRowid;
};

export const getCommentsByPostId = async (db: Database, postId: number) => {
  const stmt = db.prepare('SELECT * FROM comments WHERE postId = ?');
  return stmt.all(postId);
};

export const deleteComment = async (db: Database, id: number) => {
  const stmt = db.prepare('DELETE FROM comments WHERE id = ?');
  return stmt.run(id);
};
