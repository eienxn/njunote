import { Request, Response } from 'express';
import db from '../config/database';
import { TagDAO } from '../dao/tagDAO';
import { TagService } from '../services/tagService';

const tagDAO = new TagDAO(db);
const tagService = new TagService(tagDAO, db);

/**
 * GET /api/tags/trending
 * 获取热门标签
 */
export async function getTrendingTags(req: Request, res: Response) {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    
    const tags = tagService.getTrendingTags(limit);
    
    res.json({
      success: true,
      data: tags
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
 * GET /api/tags/:name/posts
 * 获取某个标签下的所有笔记
 */
export async function getPostsByTag(req: Request, res: Response) {
  try {
    const { name } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 20;
    
    const result = tagService.getPostsByTag(name, page, pageSize);
    
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
