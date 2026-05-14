import Database from 'better-sqlite3';

export interface Tag {
  id: number;
  name: string;
  created_at: number;
}

export interface TagWithCount extends Tag {
  count: number;
}

export class TagDAO {
  constructor(private db: Database.Database) {}

  /**
   * 查找或创建标签
   * @param name 标签名称
   * @returns 标签对象
   */
  findOrCreate(name: string): Tag {
    // 先尝试查找
    const existing = this.db.prepare('SELECT * FROM tags WHERE name = ?').get(name) as Tag | undefined;
    
    if (existing) {
      return existing;
    }
    
    // 不存在则创建
    const now = Date.now();
    const result = this.db.prepare('INSERT INTO tags (name, created_at) VALUES (?, ?)').run(name, now);
    
    return {
      id: result.lastInsertRowid as number,
      name,
      created_at: now
    };
  }

  /**
   * 关联笔记与标签
   * @param postId 笔记ID
   * @param tagId 标签ID
   */
  linkPostToTag(postId: number, tagId: number): void {
    const now = Date.now();
    
    try {
      this.db.prepare('INSERT INTO post_tags (post_id, tag_id, created_at) VALUES (?, ?, ?)').run(postId, tagId, now);
    } catch (error: any) {
      // 如果是唯一约束冲突，忽略（已经关联过了）
      if (error.code !== 'SQLITE_CONSTRAINT_UNIQUE') {
        throw error;
      }
    }
  }

  /**
   * 获取热门标签
   * @param days 统计最近几天
   * @param limit 返回数量限制
   * @returns 标签列表（按笔记数降序）
   */
  getTrendingTags(days: number, limit: number): TagWithCount[] {
    const cutoffTime = Date.now() - days * 24 * 60 * 60 * 1000;
    
    const sql = `
      SELECT 
        tags.id,
        tags.name,
        tags.created_at,
        COUNT(DISTINCT posts.id) as count
      FROM tags
      JOIN post_tags ON tags.id = post_tags.tag_id
      JOIN posts ON post_tags.post_id = posts.id
      WHERE posts.created_at >= ?
        AND posts.deleted_at IS NULL
      GROUP BY tags.id
      ORDER BY count DESC
      LIMIT ?
    `;
    
    return this.db.prepare(sql).all(cutoffTime, limit) as TagWithCount[];
  }

  /**
   * 根据标签名获取标签
   * @param name 标签名称
   * @returns 标签对象或undefined
   */
  findByName(name: string): Tag | undefined {
    return this.db.prepare('SELECT * FROM tags WHERE name = ?').get(name) as Tag | undefined;
  }
}
