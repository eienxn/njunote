import { Router } from 'express';
import * as userController from '../controllers/userController';
import { authenticate } from '../middleware/auth';

const router = Router();

// GET /api/users/:id - 获取用户基本信息
router.get('/:id', userController.getUserProfile);

// GET /api/users/:id/posts - 获取用户发布的笔记
router.get('/:id/posts', userController.getUserPosts);

// GET /api/users/:id/bookmarks - 获取用户收藏的笔记（需要认证，仅本人可见）
router.get('/:id/bookmarks', authenticate, userController.getUserBookmarks);

// GET /api/users/:id/stats - 获取用户统计信息
router.get('/:id/stats', userController.getUserStats);

// PUT /api/users/me - 更新当前用户资料（需要认证）
router.put('/me', authenticate, userController.updateProfile);

export default router;
