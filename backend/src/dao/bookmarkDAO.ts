import Database from 'better-sqlite3';

export interface Bookmark {
  id: number;
  user_id: number;
  post_id: number;
  created_at: number;
}

export class BookmarkDAO {
  constructor(private db: Database.Database) {}

  /**
   * 添加收藏
   */
  addBookmark(userId: number, postId: number): void {
    const now = Date.now();
    
    try {
      this.db.prepare('INSERT INTO bookmarks (user_id, post_id, created_at) VALUES (?, ?, ?)').run(userId, postId, now);
    } catch (error: any) {
      // 如果是唯一约束冲突，忽略（已经收藏过了）
      if (error.code !== 'SQLITE_CONSTRAINT_UNIQUE') {
        throw error;
      }
    }
  }

  /**
   * 取消收藏
   */
  removeBookmark(userId: number, postId: number): void {
    this.db.prepare('DELETE FROM bookmarks WHERE user_id = ? AND post_id = ?').run(userId, postId);
  }

  /**
   * 检查是否已收藏
   */
  isBookmarked(userId: number, postId: number): boolean {
    const result = this.db.prepare('SELECT 1 FROM bookmarks WHERE user_id = ? AND post_id = ?').get(userId, postId);
    return !!result;
  }

  /**
   * 获取用户的收藏列表
   */
  getUserBookmarks(userId: number, page: number, pageSize: number): {
    posts: any[];
    total: number;
  } {
    // 获取总数
    const countResult = this.db.prepare(`
      SELECT COUNT(*) as count
      FROM bookmarks
      JOIN posts ON bookmarks.post_id = posts.id
      WHERE bookmarks.user_id = ?
        AND posts.deleted_at IS NULL
    `).get(userId) as { count: number };

    const total = countResult.count;

    // 获取收藏列表
    const offset = (page - 1) * pageSize;
    const posts = this.db.prepare(`
      SELECT 
        posts.*,
        users.id as author_id,
        users.nickname as author_nickname,
        users.avatar as author_avatar
      FROM bookmarks
      JOIN posts ON bookmarks.post_id = posts.id
      JOIN users ON posts.user_id = users.id
      WHERE bookmarks.user_id = ?
        AND posts.deleted_at IS NULL
      ORDER BY bookmarks.created_at DESC
      LIMIT ? OFFSET ?
    `).all(userId, pageSize, offset);

    return { posts, total };
  }
}
