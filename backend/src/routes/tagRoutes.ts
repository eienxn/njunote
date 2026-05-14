import { Router } from 'express';
import * as tagController from '../controllers/tagController';

const router = Router();

// GET /api/tags/trending - 获取热门标签
router.get('/trending', tagController.getTrendingTags);

// GET /api/tags/:name/posts - 获取某个标签下的笔记
router.get('/:name/posts', tagController.getPostsByTag);

export default router;
