import { describe, it, expect, beforeEach } from 'vitest';
import Database from 'better-sqlite3';
import { TagDAO } from '../../../src/dao/tagDAO';

describe('TagDAO', () => {
  let db: Database.Database;
  let tagDAO: TagDAO;

  beforeEach(() => {
    // 使用内存数据库
    db = new Database(':memory:');
    
    // 创建必要的表
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
    `);

    tagDAO = new TagDAO(db);
  });

  describe('findOrCreate', () => {
    it('should create a new tag if not exists', () => {
      const tag = tagDAO.findOrCreate('typescript');
      
      expect(tag).toBeDefined();
      expect(tag.name).toBe('typescript');
      expect(tag.id).toBeGreaterThan(0);
    });

    it('should return existing tag if already exists', () => {
      const tag1 = tagDAO.findOrCreate('typescript');
      const tag2 = tagDAO.findOrCreate('typescript');
      
      expect(tag1.id).toBe(tag2.id);
      expect(tag1.name).toBe(tag2.name);
    });

    it('should handle multiple different tags', () => {
      const tag1 = tagDAO.findOrCreate('typescript');
      const tag2 = tagDAO.findOrCreate('javascript');
      const tag3 = tagDAO.findOrCreate('react');
      
      expect(tag1.id).not.toBe(tag2.id);
      expect(tag2.id).not.toBe(tag3.id);
    });
  });

  describe('linkPostToTag', () => {
    it('should link a post to a tag', () => {
      // 创建测试数据
      db.prepare('INSERT INTO posts (user_id, content, created_at, updated_at) VALUES (?, ?, ?, ?)').run(1, 'test', Date.now(), Date.now());
      const postId = db.prepare('SELECT last_insert_rowid() as id').get() as { id: number };
      
      const tag = tagDAO.findOrCreate('typescript');
      tagDAO.linkPostToTag(postId.id, tag.id);
      
      // 验证关联
      const link = db.prepare('SELECT * FROM post_tags WHERE post_id = ? AND tag_id = ?').get(postId.id, tag.id);
      expect(link).toBeDefined();
    });

    it('should not create duplicate links', () => {
      db.prepare('INSERT INTO posts (user_id, content, created_at, updated_at) VALUES (?, ?, ?, ?)').run(1, 'test', Date.now(), Date.now());
      const postId = db.prepare('SELECT last_insert_rowid() as id').get() as { id: number };
      
      const tag = tagDAO.findOrCreate('typescript');
      tagDAO.linkPostToTag(postId.id, tag.id);
      
      // 尝试重复关联应该不报错（UNIQUE约束会被忽略）
      expect(() => tagDAO.linkPostToTag(postId.id, tag.id)).not.toThrow();
    });
  });

  describe('getTrendingTags', () => {
    it('should return trending tags ordered by post count', () => {
      // 创建测试数据
      const now = Date.now();
      const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;
      
      // 创建3个标签
      const tag1 = tagDAO.findOrCreate('typescript');
      const tag2 = tagDAO.findOrCreate('javascript');
      const tag3 = tagDAO.findOrCreate('react');
      
      // 创建笔记并关联标签
      // typescript: 3个笔记
      for (let i = 0; i < 3; i++) {
        db.prepare('INSERT INTO posts (user_id, content, created_at, updated_at) VALUES (?, ?, ?, ?)').run(1, 'test', now, now);
        const postId = db.prepare('SELECT last_insert_rowid() as id').get() as { id: number };
        tagDAO.linkPostToTag(postId.id, tag1.id);
      }
      
      // javascript: 2个笔记
      for (let i = 0; i < 2; i++) {
        db.prepare('INSERT INTO posts (user_id, content, created_at, updated_at) VALUES (?, ?, ?, ?)').run(1, 'test', now, now);
        const postId = db.prepare('SELECT last_insert_rowid() as id').get() as { id: number };
        tagDAO.linkPostToTag(postId.id, tag2.id);
      }
      
      // react: 1个笔记
      db.prepare('INSERT INTO posts (user_id, content, created_at, updated_at) VALUES (?, ?, ?, ?)').run(1, 'test', now, now);
      const postId = db.prepare('SELECT last_insert_rowid() as id').get() as { id: number };
      tagDAO.linkPostToTag(postId.id, tag3.id);
      
      const trending = tagDAO.getTrendingTags(7, 10);
      
      expect(trending).toHaveLength(3);
      expect(trending[0].name).toBe('typescript');
      expect(trending[0].count).toBe(3);
      expect(trending[1].name).toBe('javascript');
      expect(trending[1].count).toBe(2);
      expect(trending[2].name).toBe('react');
      expect(trending[2].count).toBe(1);
    });

    it('should limit results', () => {
      const now = Date.now();
      
      // 创建5个标签，每个1个笔记
      for (let i = 0; i < 5; i++) {
        const tag = tagDAO.findOrCreate(`tag${i}`);
        db.prepare('INSERT INTO posts (user_id, content, created_at, updated_at) VALUES (?, ?, ?, ?)').run(1, 'test', now, now);
        const postId = db.prepare('SELECT last_insert_rowid() as id').get() as { id: number };
        tagDAO.linkPostToTag(postId.id, tag.id);
      }
      
      const trending = tagDAO.getTrendingTags(7, 3);
      expect(trending).toHaveLength(3);
    });
  });
});
