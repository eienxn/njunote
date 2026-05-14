import { Request, Response } from 'express';
import { TagService } from '../services/tagService';

export class TagController {
  constructor(private tagService: TagService) {}

  /**
   * GET /api/tags/trending
   * 获取热门标签
   */
  getTrendingTags = async (req: Request, res: Response) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      
      const tags = this.tagService.getTrendingTags(limit);
      
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
  };

  /**
   * GET /api/tags/:name/posts
   * 获取某个标签下的所有笔记
   */
  getPostsByTag = async (req: Request, res: Response) => {
    try {
      const { name } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const pageSize = parseInt(req.query.pageSize as string) || 20;
      
      const result = this.tagService.getPostsByTag(name, page, pageSize);
      
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
  };
}
