import { describe, it, expect, beforeEach, vi } from 'vitest';
import Database from 'better-sqlite3';
import { TagService } from '../../../src/services/tagService';
import { TagDAO } from '../../../src/dao/tagDAO';

describe('TagService', () => {
  let db: Database.Database;
  let tagService: TagService;

  beforeEach(() => {
    db = new Database(':memory:');
    
    db.exec(`
      CREATE TABLE tags (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL,
        created_at INTEGER NOT NULL
      );

      CREATE TABLE posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        content TEXT NOT NULL,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL,
        deleted_at INTEGER
      );

      CREATE TABLE post_tags (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        post_id INTEGER NOT NULL,
        tag_id INTEGER NOT NULL,
        created_at INTEGER NOT NULL,
        UNIQUE(post_id, tag_id),
        FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
        FOREIGN KEY (tag_id) REFERENCES tags(id)
      );

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

      CREATE TABLE post_images (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        post_id INTEGER NOT NULL,
        image_path TEXT NOT NULL,
        position INTEGER NOT NULL,
        created_at INTEGER NOT NULL,
        FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
      );
    `);

    const tagDAO = new TagDAO(db);
    tagService = new TagService(tagDAO, db);
  });

  describe('processPostTags', () => {
    it('should extract and link hashtags from post content', () => {
      const postId = 1;
      const content = '今天学习了 #typescript 和 #javascript 很有收获';
      
      // 创建测试笔记
      db.prepare('INSERT INTO posts (id, user_id, content, created_at, updated_at) VALUES (?, ?, ?, ?, ?)').run(postId, 1, content, Date.now(), Date.now());
      
      tagService.processPostTags(postId, content);
      
      // 验证标签已创建
      const tags = db.prepare('SELECT * FROM tags').all();
      expect(tags).toHaveLength(2);
      
      // 验证关联已创建
      const links = db.prepare('SELECT * FROM post_tags WHERE post_id = ?').all(postId);
      expect(links).toHaveLength(2);
    });

    it('should handle content without hashtags', () => {
      const postId = 1;
      const content = '这是一段普通文本';
      
      db.prepare('INSERT INTO posts (id, user_id, content, created_at, updated_at) VALUES (?, ?, ?, ?, ?)').run(postId, 1, content, Date.now(), Date.now());
      
      tagService.processPostTags(postId, content);
      
      const tags = db.prepare('SELECT * FROM tags').all();
      expect(tags).toHaveLength(0);
    });

    it('should handle duplicate hashtags in same post', () => {
      const postId = 1;
      const content = '#typescript 学习 #typescript 很有趣';
      
      db.prepare('INSERT INTO posts (id, user_id, content, created_at, updated_at) VALUES (?, ?, ?, ?, ?)').run(postId, 1, content, Date.now(), Date.now());
      
      tagService.processPostTags(postId, content);
      
      // 应该只创建一个标签
      const tags = db.prepare('SELECT * FROM tags').all();
      expect(tags).toHaveLength(1);
      
      // 应该只有一个关联
      const links = db.prepare('SELECT * FROM post_tags WHERE post_id = ?').all(postId);
      expect(links).toHaveLength(1);
    });
  });

  describe('getPostsByTag', () => {
    it('should return posts with the specified tag', () => {
      const now = Date.now();
      
      // 创建用户
      db.prepare('INSERT INTO users (email, password, nickname, avatar, bio, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)').run('test@test.com', 'pass', 'TestUser', '😀', '', now, now);
      
      // 创建笔记
      db.prepare('INSERT INTO posts (user_id, content, created_at, updated_at) VALUES (?, ?, ?, ?)').run(1, 'Post 1 #typescript', now, now);
      const post1Id = (db.prepare('SELECT last_insert_rowid() as id').get() as any).id;
      
      db.prepare('INSERT INTO posts (user_id, content, created_at, updated_at) VALUES (?, ?, ?, ?)').run(1, 'Post 2 #typescript', now, now);
      const post2Id = (db.prepare('SELECT last_insert_rowid() as id').get() as any).id;
      
      db.prepare('INSERT INTO posts (user_id, content, created_at, updated_at) VALUES (?, ?, ?, ?)').run(1, 'Post 3 #javascript', now, now);
      
      // 处理标签
      tagService.processPostTags(post1Id, 'Post 1 #typescript');
      tagService.processPostTags(post2Id, 'Post 2 #typescript');
      tagService.processPostTags(3, 'Post 3 #javascript');
      
      const result = tagService.getPostsByTag('typescript', 1, 10);
      
      expect(result.posts).toHaveLength(2);
      expect(result.total).toBe(2);
    });

    it('should return empty array for non-existent tag', () => {
      const result = tagService.getPostsByTag('nonexistent', 1, 10);
      
      expect(result.posts).toHaveLength(0);
      expect(result.total).toBe(0);
    });
  });

  describe('getTrendingTags', () => {
    it('should return trending tags', () => {
      const now = Date.now();
      
      // 创建笔记和标签
      for (let i = 0; i < 3; i++) {
        db.prepare('INSERT INTO posts (user_id, content, created_at, updated_at) VALUES (?, ?, ?, ?)').run(1, `Post ${i}`, now, now);
        const postId = (db.prepare('SELECT last_insert_rowid() as id').get() as any).id;
        tagService.processPostTags(postId, '#typescript');
      }
      
      for (let i = 0; i < 2; i++) {
        db.prepare('INSERT INTO posts (user_id, content, created_at, updated_at) VALUES (?, ?, ?, ?)').run(1, `Post ${i}`, now, now);
        const postId = (db.prepare('SELECT last_insert_rowid() as id').get() as any).id;
        tagService.processPostTags(postId, '#javascript');
      }
      
      const trending = tagService.getTrendingTags(10);
      
      expect(trending).toHaveLength(2);
      expect(trending[0].name).toBe('typescript');
      expect(trending[0].count).toBe(3);
    });
  });
});
