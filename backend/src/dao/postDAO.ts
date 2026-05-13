import Database from 'better-sqlite3';
import { Post, PostImage } from '../types';

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
