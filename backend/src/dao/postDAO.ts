import Database from 'better-sqlite3';
import { Post, PostImage, Comment } from '../types';

export const createPost = (db: Database.Database, userId: number, content: string): Post => {
  const stmt = db.prepare('INSERT INTO posts (user_id, content) VALUES (?, ?)');
  const info = stmt.run(userId, content);
  const newPost = findPostById(db, Number(info.lastInsertRowid));
  if (!newPost) {
    throw new Error('Failed to create or find new post');
  }
  return newPost;
};

export const findPostById = (db: Database.Database, postId: number, includeDeleted = false): Post | null => {
  let query = 'SELECT * FROM posts WHERE id = ?';
  if (!includeDeleted) {
    query += ' AND deleted_at IS NULL';
  }
  const stmt = db.prepare(query);
  const post = stmt.get(postId);
  return (post as Post) || null;
};

export const deletePostById = (db: Database.Database, postId: number): void => {
  const stmt = db.prepare("UPDATE posts SET deleted_at = datetime('now') WHERE id = ?");
  stmt.run(postId);
};

export const addImageToPost = (db: Database.Database, postId: number, imageUrl: string, displayOrder: number): PostImage => {
  const stmt = db.prepare('INSERT INTO post_images (post_id, image_url, display_order) VALUES (?, ?, ?)');
  const info = stmt.run(postId, imageUrl, displayOrder);

  const imageStmt = db.prepare('SELECT * FROM post_images WHERE id = ?');
  const postImage = imageStmt.get(info.lastInsertRowid);

  if (!postImage) {
      throw new Error('Failed to create or find post image');
  }

  return postImage as PostImage;
};

export const getPostsByUser = (db: Database.Database, userId: number): Post[] => {
    const stmt = db.prepare('SELECT * FROM posts WHERE user_id = ? AND deleted_at IS NULL ORDER BY created_at DESC');
    return stmt.all(userId) as Post[];
};

export const likePost = (db: Database.Database, postId: number, userId: number): void => {
    const stmt = db.prepare('INSERT OR IGNORE INTO likes (post_id, user_id) VALUES (?, ?)');
    stmt.run(postId, userId);
};

export const unlikePost = (db: Database.Database, postId: number, userId: number): void => {
    const stmt = db.prepare('DELETE FROM likes WHERE post_id = ? AND user_id = ?');
    stmt.run(postId, userId);
};

export const getLikesCount = (db: Database.Database, postId: number): number => {
    const stmt = db.prepare('SELECT COUNT(*) as count FROM likes WHERE post_id = ?');
    const result = stmt.get(postId);
    return (result as { count: number }).count;
};

export const addComment = (db: Database.Database, postId: number, userId: number, comment: string): void => {
    const stmt = db.prepare('INSERT INTO comments (post_id, user_id, content) VALUES (?, ?, ?)');
    stmt.run(postId, userId, comment);
};

export const getCommentsForPost = (db: Database.Database, postId: number): Comment[] => {
    const stmt = db.prepare('SELECT c.*, u.username FROM comments c JOIN users u ON c.user_id = u.id WHERE c.post_id = ? ORDER BY c.created_at ASC');
    return stmt.all(postId) as Comment[];
};

export const searchPosts = (db: Database.Database, query: string): Post[] => {
  const stmt = db.prepare('SELECT * FROM posts WHERE content LIKE ? AND deleted_at IS NULL');
  return stmt.all(`%${query}%`) as Post[];
};

