
import { Router } from 'express';
import { FollowController } from '../controllers/followController';
import { authenticate } from '../middleware/authenticate';

const router = Router();
const followController = new FollowController();

router.post('/:id/follow', authenticate, followController.followUser);
router.delete('/:id/follow', authenticate, followController.unfollowUser);
router.get('/followers', authenticate, followController.getFollowers);
router.get('/following', authenticate, followController.getFollowing);

export default router;
