// backend/src/routes/postRoutes.ts
import { Router } from 'express';
import * as postController from '../controllers/postController';
import { authenticate } from '../middleware/auth';
import upload from '../middleware/upload';

const router = Router();

router.post('/', authenticate, upload.array('images', 5), postController.createPost);
router.delete('/:id', authenticate, postController.deletePost);
router.post('/:id/like', authenticate, postController.likePost);
router.delete('/:id/like', authenticate, postController.unlikePost);
router.post('/:id/comments', authenticate, postController.addComment);
router.get('/:id/comments', postController.getComments);
router.get('/search', postController.searchPosts);


export default router;
