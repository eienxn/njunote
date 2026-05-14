import { Request, Response } from 'express';
import db from '../config/database';
import { BookmarkDAO } from '../dao/bookmarkDAO';
import * as userDAO from '../dao/userDAO';

const bookmarkDAO = new BookmarkDAO(db);

/**
 * GET /api/users/:id
 * 获取用户基本信息
 */
export async function getUserProfile(req: Request, res: Response) {
  try {
    const userId = parseInt(req.params.id);
    
    const user = userDAO.findUserById(db, userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found'
        }
      });
    }

    // 不返回密码
    const { password, ...userWithoutPassword } = user;

    res.json({
      success: true,
      data: userWithoutPassword
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: error.message
      }
    });
  }
}

/**
 * GET /api/users/:id/posts
 * 获取用户发布的笔记
 */
export async function getUserPosts(req: Request, res: Response) {
  try {
    const userId = parseInt(req.params.id);
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 20;
    const offset = (page - 1) * pageSize;

    // 获取总数
    const countResult = db.prepare(`
      SELECT COUNT(*) as count
      FROM posts
      WHERE user_id = ? AND deleted_at IS NULL
    `).get(userId) as { count: number };

    // 获取笔记列表
    const posts = db.prepare(`
      SELECT 
        posts.*,
        users.id as author_id,
        users.nickname as author_nickname,
        users.avatar as author_avatar
      FROM posts
      JOIN users ON posts.user_id = users.id
      WHERE posts.user_id = ? AND posts.deleted_at IS NULL
      ORDER BY posts.created_at DESC
      LIMIT ? OFFSET ?
    `).all(userId, pageSize, offset);

    res.json({
      success: true,
      data: {
        posts,
        total: countResult.count,
        page,
        pageSize,
        totalPages: Math.ceil(countResult.count / pageSize)
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: error.message
      }
    });
  }
}

/**
 * GET /api/users/:id/bookmarks
 * 获取用户收藏的笔记（仅本人可见）
 */
export async function getUserBookmarks(req: Request, res: Response) {
  try {
    const userId = parseInt(req.params.id);
    const currentUserId = (req as any).user?.id;

    // 只有本人可以查看收藏
    if (currentUserId !== userId) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'You can only view your own bookmarks'
        }
      });
    }

    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 20;

    const result = bookmarkDAO.getUserBookmarks(userId, page, pageSize);

    res.json({
      success: true,
      data: {
        posts: result.posts,
        total: result.total,
        page,
        pageSize,
        totalPages: Math.ceil(result.total / pageSize)
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: error.message
      }
    });
  }
}

/**
 * GET /api/users/:id/stats
 * 获取用户统计信息
 */
export async function getUserStats(req: Request, res: Response) {
  try {
    const userId = parseInt(req.params.id);

    // 笔记数
    const postsCount = db.prepare('SELECT COUNT(*) as count FROM posts WHERE user_id = ? AND deleted_at IS NULL').get(userId) as { count: number };

    // 关注数
    const followingCount = db.prepare('SELECT COUNT(*) as count FROM follows WHERE follower_id = ?').get(userId) as { count: number };

    // 粉丝数
    const followersCount = db.prepare('SELECT COUNT(*) as count FROM follows WHERE followee_id = ?').get(userId) as { count: number };

    res.json({
      success: true,
      data: {
        postsCount: postsCount.count,
        followingCount: followingCount.count,
        followersCount: followersCount.count
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: error.message
      }
    });
  }
}

/**
 * PUT /api/users/me
 * 更新当前用户资料
 */
export async function updateProfile(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.id;
    const { nickname, avatar, bio } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Not authenticated'
        }
      });
    }

    // 更新用户信息
    const now = Date.now();
    db.prepare('UPDATE users SET nickname = ?, avatar = ?, bio = ?, updated_at = ? WHERE id = ?')
      .run(nickname, avatar, bio, now, userId);

    const updatedUser = userDAO.findUserById(db, userId);
    const { password, ...userWithoutPassword } = updatedUser!;

    res.json({
      success: true,
      data: userWithoutPassword
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: error.message
      }
    });
  }
}
