import { describe, it, expect, beforeEach } from 'vitest';
import Database from 'better-sqlite3';
import { BookmarkDAO } from '../../../src/dao/bookmarkDAO';

describe('BookmarkDAO', () => {
  let db: Database.Database;
  let bookmarkDAO: BookmarkDAO;

  beforeEach(() => {
    db = new Database(':memory:');
    
    db.exec(`
      CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        nickname TEXT NOT NULL,
        avatar TEXT NOT NULL,
        bio TEXT DEFAULT '',
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      );

      CREATE TABLE posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        content TEXT NOT NULL,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL,
        deleted_at INTEGER,
        FOREIGN KEY (user_id) REFERENCES users(id)
      );

      CREATE TABLE bookmarks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        post_id INTEGER NOT NULL,
        created_at INTEGER NOT NULL,
        UNIQUE(user_id, post_id),
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
      );
    `);

    bookmarkDAO = new BookmarkDAO(db);
  });

  describe('addBookmark', () => {
    it('should add a bookmark', () => {
      const now = Date.now();
      db.prepare('INSERT INTO users (email, password, nickname, avatar, bio, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)').run('test@test.com', 'pass', 'Test', '😀', '', now, now);
      db.prepare('INSERT INTO posts (user_id, content, created_at, updated_at) VALUES (?, ?, ?, ?)').run(1, 'Test post', now, now);

      bookmarkDAO.addBookmark(1, 1);

      const bookmark = db.prepare('SELECT * FROM bookmarks WHERE user_id = ? AND post_id = ?').get(1, 1);
      expect(bookmark).toBeDefined();
    });

    it('should not create duplicate bookmarks', () => {
      const now = Date.now();
      db.prepare('INSERT INTO users (email, password, nickname, avatar, bio, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)').run('test@test.com', 'pass', 'Test', '😀', '', now, now);
      db.prepare('INSERT INTO posts (user_id, content, created_at, updated_at) VALUES (?, ?, ?, ?)').run(1, 'Test post', now, now);

      bookmarkDAO.addBookmark(1, 1);
      expect(() => bookmarkDAO.addBookmark(1, 1)).not.toThrow();

      const count = db.prepare('SELECT COUNT(*) as count FROM bookmarks WHERE user_id = ? AND post_id = ?').get(1, 1) as { count: number };
      expect(count.count).toBe(1);
    });
  });

  describe('removeBookmark', () => {
    it('should remove a bookmark', () => {
      const now = Date.now();
      db.prepare('INSERT INTO users (email, password, nickname, avatar, bio, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)').run('test@test.com', 'pass', 'Test', '😀', '', now, now);
      db.prepare('INSERT INTO posts (user_id, content, created_at, updated_at) VALUES (?, ?, ?, ?)').run(1, 'Test post', now, now);

      bookmarkDAO.addBookmark(1, 1);
      bookmarkDAO.removeBookmark(1, 1);

      const bookmark = db.prepare('SELECT * FROM bookmarks WHERE user_id = ? AND post_id = ?').get(1, 1);
      expect(bookmark).toBeUndefined();
    });
  });

  describe('getUserBookmarks', () => {
    it('should return user bookmarks', () => {
      const now = Date.now();
      db.prepare('INSERT INTO users (email, password, nickname, avatar, bio, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)').run('test@test.com', 'pass', 'Test', '😀', '', now, now);
      
      for (let i = 0; i < 3; i++) {
        db.prepare('INSERT INTO posts (user_id, content, created_at, updated_at) VALUES (?, ?, ?, ?)').run(1, `Post ${i}`, now, now);
        const postId = (db.prepare('SELECT last_insert_rowid() as id').get() as any).id;
        bookmarkDAO.addBookmark(1, postId);
      }

      const bookmarks = bookmarkDAO.getUserBookmarks(1, 1, 10);
      expect(bookmarks.posts).toHaveLength(3);
      expect(bookmarks.total).toBe(3);
    });
  });
});
