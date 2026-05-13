
import { Response } from 'express';
import { CommentService } from '../services/commentService';
import { PostService } from '../services/postService';
import { CustomRequest } from '../middleware/authenticate';

export class CommentController {
    private commentService: CommentService;
    private postService: PostService;

    constructor() {
        this.commentService = new CommentService();
        this.postService = new PostService();
    }

    addComment = async (req: CustomRequest, res: Response) => {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({ message: 'Unauthorized' });
            }
            const postId = parseInt(req.params.id, 10);
            const { content } = req.body;

            if (!content) {
                return res.status(400).json({ message: 'Comment content is required' });
            }

            const post = await this.postService.getPostById(postId);
            if (!post) {
                return res.status(404).json({ message: 'Post not found' });
            }

            const comment = await this.commentService.addComment(userId, postId, content);
            res.status(201).json(comment);
        } catch (error) {
            res.status(500).json({ message: 'Error adding comment', error });
        }
    };

    getComments = async (req: Request, res: Response) => {
        try {
            const postId = parseInt(req.params.id, 10);
            const comments = await this.commentService.getCommentsByPostId(postId);
            res.status(200).json(comments);
        } catch (error) {
            res.status(500).json({ message: 'Error getting comments', error });
        }
    };

    deleteComment = async (req: CustomRequest, res: Response) => {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({ message: 'Unauthorized' });
            }
            const commentId = parseInt(req.params.commentId, 10);

            const comment = await this.commentService.getCommentById(commentId);
            if (!comment) {
                return res.status(404).json({ message: 'Comment not found' });
            }

            if (comment.userId !== userId) {
                return res.status(403).json({ message: 'Forbidden: You can only delete your own comments' });
            }

            await this.commentService.deleteComment(commentId);
            res.status(200).json({ message: 'Comment deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Error deleting comment', error });
        }
    };
}
