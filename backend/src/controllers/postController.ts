// backend/src/controllers/postController.ts
import { Request, Response } from 'express';
import * as postService from '../services/postService';
import { AuthenticatedRequest } from '../types';

export const createPost = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { content } = req.body;
        const userId = req.user!.id;
        const files = req.files as Express.Multer.File[];
        const imageUrls = files.map(file => `/uploads/${file.filename}`);

        if (!content) {
            return res.status(400).json({ message: 'Content is required' });
        }

        const post = await postService.createPost(userId, content, imageUrls);
        res.status(201).json(post);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: 'Error creating post', error: error.message });
        } else {
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
};

export const deletePost = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const postId = parseInt(req.params.id, 10);
        const userId = req.user!.id;

        if (isNaN(postId)) {
            return res.status(400).json({ message: 'Invalid post ID' });
        }

        await postService.deletePost(postId, userId);
        res.status(204).send();
    } catch (error) {
        if (error instanceof Error) {
            if (error.message === 'Post not found') {
                return res.status(404).json({ message: 'Post not found' });
            }
            if (error.message === 'Unauthorized') {
                return res.status(403).json({ message: 'You are not authorized to delete this post' });
            }
            res.status(500).json({ message: 'Error deleting post', error: error.message });
        } else {
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
};

export const likePost = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const postId = parseInt(req.params.id, 10);
        const userId = req.user!.id;
        await postService.likePost(postId, userId);
        res.status(200).json({ message: 'Post liked successfully' });
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: 'Error liking post', error: error.message });
        } else {
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
};

export const unlikePost = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const postId = parseInt(req.params.id, 10);
        const userId = req.user!.id;
        await postService.unlikePost(postId, userId);
        res.status(200).json({ message: 'Post unliked successfully' });
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: 'Error unliking post', error: error.message });
        } else {
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
};

export const addComment = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const postId = parseInt(req.params.id, 10);
        const userId = req.user!.id;
        const { content } = req.body;
        await postService.addComment(postId, userId, content);
        res.status(201).json({ message: 'Comment added successfully' });
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: 'Error adding comment', error: error.message });
        } else {
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
};

export const getComments = async (req: Request, res: Response) => {
    try {
        const postId = parseInt(req.params.id, 10);
        const comments = await postService.getComments(postId);
        res.status(200).json(comments);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: 'Error getting comments', error: error.message });
        } else {
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
};

export const searchPosts = async (req: Request, res: Response) => {
    try {
        const { q } = req.query;
        if (typeof q !== 'string') {
            return res.status(400).json({ message: 'Query parameter is required' });
        }
        const posts = await postService.searchPosts(q);
        res.status(200).json(posts);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: 'Error searching posts', error: error.message });
        } else {
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
};
