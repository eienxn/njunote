// backend/tests/unit/dao/postDAO.test.ts
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import * as postDAO from '../../../src/dao/postDAO';
import * as userDAO from '../../../src/dao/userDAO';
import { NewUser } from '../../../src/types';

describe('PostDAO', () => {
  const testDbPath = path.join(__dirname, '../../test-post.db');
  let db: Database.Database;
  let testUser: NewUser & { id: number };

  beforeEach(() => {
    db = new Database(testDbPath);
    db.pragma('foreign_keys = ON');
    // Create tables
    db.exec(`
      CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        nickname TEXT NOT NULL,
        avatar TEXT NOT NULL DEFAULT '😀',
        bio TEXT DEFAULT '',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);
    db.exec(`
      CREATE TABLE posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        content TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        deleted_at DATETIME,
        FOREIGN KEY (user_id) REFERENCES users (id)
      );
    `);
    db.exec(`
      CREATE TABLE post_images (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        post_id INTEGER NOT NULL,
        image_url TEXT NOT NULL,
        display_order INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (post_id) REFERENCES posts (id)
      );
    `);

    // Create a test user
    testUser = userDAO.create(db, {
      email: 'test@example.com',
      password: 'password123',
      nickname: 'testuser',
    });
  });

  afterEach(() => {
    db.close();
    if (fs.existsSync(testDbPath)) {
      fs.unlinkSync(testDbPath);
    }
  });

  describe('createPost', () => {
    it('should create a new post and return it', () => {
      const postData = {
        userId: testUser.id,
        content: 'This is a test post.',
      };
      const newPost = postDAO.createPost(db, postData.userId, postData.content);
      expect(newPost).toBeDefined();
      expect(newPost.id).toBeTypeOf('number');
      expect(newPost.content).toBe(postData.content);
      expect(newPost.user_id).toBe(postData.userId);
    });
  });

  describe('findPostById', () => {
    it('should find a post by its ID', () => {
      const post = postDAO.createPost(db, testUser.id, 'Test content');
      const foundPost = postDAO.findPostById(db, post.id);
      expect(foundPost).toBeDefined();
      expect(foundPost?.id).toBe(post.id);
    });

    it('should return null if post is not found', () => {
      const foundPost = postDAO.findPostById(db, 999);
      expect(foundPost).toBeNull();
    });
  });

  describe('deletePostById', () => {
    it('should soft delete a post by its ID', () => {
      const post = postDAO.createPost(db, testUser.id, 'Test content');
      postDAO.deletePostById(db, post.id);

      // We should not find it with the default query
      const foundPost = postDAO.findPostById(db, post.id);
      expect(foundPost).toBeNull();

      // We should find it if we include deleted posts
      const deletedPost = postDAO.findPostById(db, post.id, true);
      expect(deletedPost).toBeDefined();
      expect(deletedPost?.deleted_at).not.toBeNull();
    });
  });

  describe('addImageToPost', () => {
    it('should add an image to a post', () => {
      const post = postDAO.createPost(db, testUser.id, 'Test content');
      const imageUrl = 'http://example.com/image.jpg';
      const order = 1;
      const postImage = postDAO.addImageToPost(db, post.id, imageUrl, order);
      expect(postImage).toBeDefined();
      expect(postImage.post_id).toBe(post.id);
      expect(postImage.image_url).toBe(imageUrl);
      expect(postImage.display_order).toBe(order);
    });
  });
});
