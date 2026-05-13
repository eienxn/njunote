import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import Database from 'better-sqlite3';
import { createFollow, deleteFollow, findFollowers, findFollowing, findFollow } from '../../../src/dao/followDAO.js';
import type { Database as DB } from 'better-sqlite3';

describe('followDAO', () => {
  let db: DB;
  let user1Id: bigint, user2Id: bigint, user3Id: bigint;

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
      CREATE TABLE IF NOT EXISTS follows (
        id INTEGER PRIMARY KEY,
        followerId INTEGER,
        followingId INTEGER,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (followerId) REFERENCES users(id),
        FOREIGN KEY (followingId) REFERENCES users(id),
        UNIQUE(followerId, followingId)
      );
    `);
  });

  afterAll(() => {
    db.close();
  });

  beforeEach(() => {
    db.exec('DELETE FROM follows');
    db.exec('DELETE FROM users');

    const stmt = db.prepare('INSERT INTO users (username, password) VALUES (?, ?)');
    user1Id = stmt.run('user1', 'pass').lastInsertRowid;
    user2Id = stmt.run('user2', 'pass').lastInsertRowid;
    user3Id = stmt.run('user3', 'pass').lastInsertRowid;
  });

  describe('createFollow', () => {
    it('should create a new follow relationship', async () => {
      const followId = await createFollow(db, Number(user1Id), Number(user2Id));
      expect(followId).toBeTypeOf('number');

      const follow = db.prepare('SELECT * FROM follows WHERE id = ?').get(followId);
      expect(follow).toBeDefined();
      expect(follow.followerId).toBe(Number(user1Id));
      expect(follow.followingId).toBe(Number(user2Id));
    });

    it('should not create a duplicate follow relationship', async () => {
      await createFollow(db, Number(user1Id), Number(user2Id));
      const stmt = db.prepare('SELECT count(*) as count FROM follows');
      const firstCount = stmt.get().count;

      try {
        await createFollow(db, Number(user1Id), Number(user2Id));
      } catch (error) {
        // expect an error
      }
      const secondCount = stmt.get().count;
      expect(secondCount).toBe(firstCount);
    });
  });

  describe('deleteFollow', () => {
    it('should delete a follow relationship', async () => {
      const followId = await createFollow(db, Number(user1Id), Number(user2Id));
      const result = await deleteFollow(db, Number(followId));
      expect(result.changes).toBe(1);

      const follow = db.prepare('SELECT * FROM follows WHERE id = ?').get(followId);
      expect(follow).toBeUndefined();
    });
  });

  describe('findFollow', () => {
    it('should find a follow relationship', async () => {
      await createFollow(db, Number(user1Id), Number(user2Id));
      const follow = await findFollow(db, Number(user1Id), Number(user2Id));
      expect(follow).toBeDefined();
      expect(follow.followerId).toBe(Number(user1Id));
      expect(follow.followingId).toBe(Number(user2Id));
    });
  });

  describe('findFollowers', () => {
    it('should return all followers for a given user', async () => {
      await createFollow(db, Number(user1Id), Number(user3Id));
      await createFollow(db, Number(user2Id), Number(user3Id));

      const followers = await findFollowers(db, Number(user3Id));
      expect(followers).toHaveLength(2);
      const followerIds = followers.map(f => f.followerId);
      expect(followerIds).toContain(Number(user1Id));
      expect(followerIds).toContain(Number(user2Id));
    });
  });

  describe('findFollowing', () => {
    it('should return all users a given user is following', async () => {
      await createFollow(db, Number(user1Id), Number(user2Id));
      await createFollow(db, Number(user1Id), Number(user3Id));

      const following = await findFollowing(db, Number(user1Id));
      expect(following).toHaveLength(2);
      const followingIds = following.map(f => f.followingId);
      expect(followingIds).toContain(Number(user2Id));
      expect(followingIds).toContain(Number(user3Id));
    });
  });
});
