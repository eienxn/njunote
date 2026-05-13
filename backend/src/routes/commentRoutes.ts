
import { Router } from 'express';
import { CommentController } from '../controllers/commentController';
import { authenticate } from '../middleware/authenticate';

const router = Router();
const commentController = new CommentController();

router.post('/:id/comments', authenticate, commentController.addComment);
router.get('/:id/comments', commentController.getComments);
router.delete('/comments/:commentId', authenticate, commentController.deleteComment);

export default router;
