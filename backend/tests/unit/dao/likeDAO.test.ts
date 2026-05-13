
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import Database from 'better-sqlite3';
import { createLike, deleteLike, findLikesByPostId, findLikesByUserId } from '../../../src/dao/likeDAO.js';
import { User } from '../../../src/types.js';

describe('LikeDAO', () => {
  let db: Database.Database;

  beforeAll(() => {
    db = new Database(':memory:');
    db.exec(`
      CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        nickname TEXT,
        avatar TEXT,
        bio TEXT
      );
      CREATE TABLE posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER NOT NULL,
        content TEXT NOT NULL,
        imageUrl TEXT,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
      );
      CREATE TABLE likes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER NOT NULL,
        postId INTEGER NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (postId) REFERENCES posts(id) ON DELETE CASCADE,
        UNIQUE (userId, postId)
      );
    `);

    // Seed users and posts
    db.prepare("INSERT INTO users (id, email, password) VALUES (1, 'user1@test.com', 'pass')").run();
    db.prepare("INSERT INTO users (id, email, password) VALUES (2, 'user2@test.com', 'pass')").run();
    db.prepare("INSERT INTO users (id, email, password) VALUES (3, 'user3@test.com', 'pass')").run();
    db.prepare("INSERT INTO users (id, email, password) VALUES (4, 'user4@test.com', 'pass')").run();
    db.prepare("INSERT INTO users (id, email, password) VALUES (5, 'user5@test.com', 'pass')").run();

    db.prepare("INSERT INTO posts (id, userId, content) VALUES (1, 1, 'post1')").run();
    db.prepare("INSERT INTO posts (id, userId, content) VALUES (2, 2, 'post2')").run();
    db.prepare("INSERT INTO posts (id, userId, content) VALUES (3, 3, 'post3')").run();
    db.prepare("INSERT INTO posts (id, userId, content) VALUES (4, 4, 'post4')").run();
    db.prepare("INSERT INTO posts (id, userId, content) VALUES (5, 5, 'post5')").run();
  });

  afterAll(() => {
    db.close();
  });

  it('should create a like and return it', async () => {
    const like = createLike(db, { userId: 1, postId: 1 });
    expect(like).toBeDefined();
    expect(like.userId).toBe(1);
    expect(like.postId).toBe(1);

    const dbLike = db.prepare('SELECT * FROM likes WHERE id = ?').get(like.id);
    expect(dbLike).toBeDefined();
  });

  it('should delete a like', async () => {
    const like = createLike(db, { userId: 2, postId: 2 });
    deleteLike(db, like.id);
    const dbLike = db.prepare('SELECT * FROM likes WHERE id = ?').get(like.id);
    expect(dbLike).toBeUndefined();
  });

  it('should find likes by post id', async () => {
    createLike(db, { userId: 3, postId: 3 });
    createLike(db, { userId: 4, postId: 3 });

    const postLikes = findLikesByPostId(db, 3);
    expect(postLikes.length).toBe(2);
  });

  it('should find likes by user id', async () => {
    createLike(db, { userId: 5, postId: 4 });
    createLike(db, { userId: 5, postId: 5 });

    const userLikes = findLikesByUserId(db, 5);
    expect(userLikes.length).toBe(2);
  });
});
