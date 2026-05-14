import { Router } from 'express';
import { TagController } from '../controllers/tagController';

export function createTagRoutes(tagController: TagController): Router {
  const router = Router();

  // GET /api/tags/trending - 获取热门标签
  router.get('/trending', tagController.getTrendingTags);

  // GET /api/tags/:name/posts - 获取某个标签下的笔记
  router.get('/:name/posts', tagController.getPostsByTag);

  return router;
}
