
import { Request, Response } from 'express';
import { LikeService } from '../services/likeService';
import { PostService } from '../services/postService';
import { CustomRequest } from '../middleware/authenticate';

export class LikeController {
    private likeService: LikeService;
    private postService: PostService;

    constructor() {
        this.likeService = new LikeService();
        this.postService = new PostService();
    }

    likePost = async (req: CustomRequest, res: Response) => {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({ message: 'Unauthorized' });
            }
            const postId = parseInt(req.params.id, 10);

            const post = await this.postService.getPostById(postId);
            if (!post) {
                return res.status(404).json({ message: 'Post not found' });
            }

            await this.likeService.likePost(userId, postId);
            res.status(201).json({ message: 'Post liked successfully' });
        } catch (error) {
            if (error instanceof Error) {
                if (error.message === 'Already liked') {
                    return res.status(409).json({ message: 'Post already liked' });
                }
            }
            res.status(500).json({ message: 'Error liking post', error });
        }
    };

    unlikePost = async (req: CustomRequest, res: Response) => {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({ message: 'Unauthorized' });
            }
            const postId = parseInt(req.params.id, 10);

            await this.likeService.unlikePost(userId, postId);
            res.status(200).json({ message: 'Post unliked successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Error unliking post', error });
        }
    };

    getLikes = async (req: Request, res: Response) => {
        try {
            const postId = parseInt(req.params.id, 10);
            const likes = await this.likeService.getLikesByPostId(postId);
            const userIds = likes.map(like => like.userId);
            res.status(200).json(userIds);
        } catch (error) {
            res.status(500).json({ message: 'Error getting likes', error });
        }
    };
}
