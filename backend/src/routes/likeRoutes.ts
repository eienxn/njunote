
import { Router } from 'express';
import { LikeController } from '../controllers/likeController';
import { authenticate } from '../middleware/authenticate';

const router = Router();
const likeController = new LikeController();

router.post('/:id/like', authenticate, likeController.likePost);
router.delete('/:id/like', authenticate, likeController.unlikePost);
router.get('/:id/likes', likeController.getLikes);

export default router;
