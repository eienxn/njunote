import * as postDAO from '../dao/postDAO';
import db from '../config/database';
import { Post, PostImage, Comment } from '../types';

export const createPost = async (userId: number, content: string, imageUrls?: string[]): Promise<Post & { images: PostImage[] }> => {
    const newPost = postDAO.createPost(db, userId, content);

    const images: PostImage[] = [];
    if (imageUrls && imageUrls.length > 0) {
        for (let i = 0; i < imageUrls.length; i++) {
            const imageUrl = imageUrls[i];
            const newImage = postDAO.addImageToPost(db, newPost.id, imageUrl, i);
            images.push(newImage);
        }
    }

    return { ...newPost, images };
}

export const deletePost = async (postId: number, userId: number): Promise<void> => {
    const post = postDAO.findPostById(db, postId);

    if (!post) {
        throw new Error('Post not found');
    }

    if (post.user_id !== userId) {
        throw new Error('Unauthorized');
    }

    postDAO.deletePostById(db, postId);
}

export const searchPosts = async (query: string): Promise<Post[]> => {
    return postDAO.searchPosts(db, query);
}