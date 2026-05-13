import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import Database from 'better-sqlite3';
import { createComment, getCommentsByPostId, deleteComment } from '../../../src/dao/commentDAO.js';
import { createUser } from '../../../src/dao/userDAO.js';
import { createPost } from '../../../src/dao/postDAO.js';
import type { Database as DB } from 'better-sqlite3';

describe('commentDAO', () => {
  let db: DB;
  let userId: bigint;
  let postId: bigint;

  beforeAll(() => {
    db = new Database(':memory:');
    db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
      );
    `);
    db.exec(`
      CREATE TABLE IF NOT EXISTS posts (
        id INTEGER PRIMARY KEY,
        userId INTEGER,
        content TEXT NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id)
      );
    `);
    db.exec(`
      CREATE TABLE IF NOT EXISTS comments (
        id INTEGER PRIMARY KEY,
        postId INTEGER,
        userId INTEGER,
        content TEXT NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (postId) REFERENCES posts(id),
        FOREIGN KEY (userId) REFERENCES users(id)
      );
    `);
  });

  afterAll(() => {
    db.close();
  });

  beforeEach(() => {
    db.exec('DELETE FROM comments');
    db.exec('DELETE FROM posts');
    db.exec('DELETE FROM users');

    // Mocking user and post creation since we are not using the real db
    const userStmt = db.prepare('INSERT INTO users (username, password) VALUES (?, ?)');
    const userInfo = userStmt.run('testuser', 'password');
    userId = userInfo.lastInsertRowid;

    const postStmt = db.prepare('INSERT INTO posts (userId, content) VALUES (?, ?)');
    const postInfo = postStmt.run(userId, 'This is a test post.');
    postId = postInfo.lastInsertRowid;
  });

  describe('createComment', () => {
    it('should create a new comment and return its id', async () => {
      const content = 'This is a comment.';
      const commentId = await createComment(db, Number(postId), Number(userId), content);
      expect(commentId).toBeTypeOf('number');

      const stmt = db.prepare('SELECT * FROM comments WHERE id = ?');
      const comment = stmt.get(commentId);
      expect(comment).toBeDefined();
      expect(comment.postId).toBe(Number(postId));
      expect(comment.userId).toBe(Number(userId));
      expect(comment.content).toBe(content);
    });
  });

  describe('getCommentsByPostId', () => {
    it('should return all comments for a given post', async () => {
      await createComment(db, Number(postId), Number(userId), 'First comment.');
      await createComment(db, Number(postId), Number(userId), 'Second comment.');

      const comments = await getCommentsByPostId(db, Number(postId));
      expect(comments).toHaveLength(2);
      expect(comments[0].content).toBe('First comment.');
      expect(comments[1].content).toBe('Second comment.');
    });

    it('should return an empty array if there are no comments', async () => {
      const comments = await getCommentsByPostId(db, Number(postId));
      expect(comments).toEqual([]);
    });
  });

  describe('deleteComment', () => {
    it('should delete a comment', async () => {
      const commentId = await createComment(db, Number(postId), Number(userId), 'A comment to be deleted.');
      const result = await deleteComment(db, Number(commentId));

      expect(result.changes).toBe(1);

      const stmt = db.prepare('SELECT * FROM comments WHERE id = ?');
      const comment = stmt.get(commentId);
      expect(comment).toBeUndefined();
    });

    it('should not fail when deleting a non-existent comment', async () => {
      const result = await deleteComment(db, 999);
      expect(result.changes).toBe(0);
    });
  });
});
