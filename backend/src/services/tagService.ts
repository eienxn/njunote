import Database from 'better-sqlite3';
import { TagDAO, TagWithCount } from '../dao/tagDAO';
import { extractHashtags } from '../utils/textParser';

export interface Post {
  id: number;
  user_id: number;
  content: string;
  created_at: number;
  updated_at: number;
  deleted_at: number | null;
  author?: {
    id: number;
    nickname: string;
    avatar: string;
  };
  images?: string[];
  tags?: string[];
}

export class TagService {
  constructor(
    private tagDAO: TagDAO,
    private db: Database.Database
  ) {}

  /**
   * 处理笔记的标签
   * 从内容中提取标签并创建关联
   * @param postId 笔记ID
   * @param content 笔记内容
   */
  processPostTags(postId: number, content: string): void {
    const hashtags = extractHashtags(content);
    
    // 去重
    const uniqueTags = [...new Set(hashtags)];
    
    // 为每个标签创建关联
    for (const tagName of uniqueTags) {
      const tag = this.tagDAO.findOrCreate(tagName);
      this.tagDAO.linkPostToTag(postId, tag.id);
    }
  }

  /**
   * 获取某个标签下的所有笔记
   * @param tagName 标签名称
   * @param page 页码（从1开始）
   * @param pageSize 每页数量
   * @returns 笔记列表和总数
   */
  getPostsByTag(tagName: string, page: number, pageSize: number): {
    posts: Post[];
    total: number;
  } {
    // 查找标签
    const tag = this.tagDAO.findByName(tagName);
    
    if (!tag) {
      return { posts: [], total: 0 };
    }
    
    // 获取总数
    const countResult = this.db.prepare(`
      SELECT COUNT(DISTINCT posts.id) as count
      FROM posts
      JOIN post_tags ON posts.id = post_tags.post_id
      WHERE post_tags.tag_id = ?
        AND posts.deleted_at IS NULL
    `).get(tag.id) as { count: number };
    
    const total = countResult.count;
    
    // 获取笔记列表
    const offset = (page - 1) * pageSize;
    const posts = this.db.prepare(`
      SELECT 
        posts.*,
        users.id as author_id,
        users.nickname as author_nickname,
        users.avatar as author_avatar
      FROM posts
      JOIN post_tags ON posts.id = post_tags.post_id
      JOIN users ON posts.user_id = users.id
      WHERE post_tags.tag_id = ?
        AND posts.deleted_at IS NULL
      ORDER BY posts.created_at DESC
      LIMIT ? OFFSET ?
    `).all(tag.id, pageSize, offset) as any[];
    
    // 格式化结果
    const formattedPosts: Post[] = posts.map(row => ({
      id: row.id,
      user_id: row.user_id,
      content: row.content,
      created_at: row.created_at,
      updated_at: row.updated_at,
      deleted_at: row.deleted_at,
      author: {
        id: row.author_id,
        nickname: row.author_nickname,
        avatar: row.author_avatar
      },
      images: this.getPostImages(row.id),
      tags: this.getPostTags(row.id)
    }));
    
    return { posts: formattedPosts, total };
  }

  /**
   * 获取热门标签
   * @param limit 返回数量限制
   * @returns 热门标签列表
   */
  getTrendingTags(limit: number = 10): TagWithCount[] {
    return this.tagDAO.getTrendingTags(7, limit);
  }

  /**
   * 获取笔记的图片列表
   * @param postId 笔记ID
   * @returns 图片路径数组
   */
  private getPostImages(postId: number): string[] {
    const images = this.db.prepare(`
      SELECT image_path 
      FROM post_images 
      WHERE post_id = ? 
      ORDER BY position
    `).all(postId) as { image_path: string }[];
    
    return images.map(img => img.image_path);
  }

  /**
   * 获取笔记的标签列表
   * @param postId 笔记ID
   * @returns 标签名称数组
   */
  private getPostTags(postId: number): string[] {
    const tags = this.db.prepare(`
      SELECT tags.name
      FROM tags
      JOIN post_tags ON tags.id = post_tags.tag_id
      WHERE post_tags.post_id = ?
    `).all(postId) as { name: string }[];
    
    return tags.map(tag => tag.name);
  }
}
