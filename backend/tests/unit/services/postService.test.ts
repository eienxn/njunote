import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as postDAO from '../../../src/dao/postDAO';
import * as postService from '../../../src/services/postService';
import db from '../../../src/config/database';

vi.mock('../../../src/dao/postDAO');
vi.mock('../../../src/config/database', () => ({
    default: {}
}));

describe('PostService', () => {

  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('createPost', () => {
    it('should create a post with content and image urls', async () => {
      const userId = 1;
      const content = 'Test post';
      const image_urls = ['http://example.com/img1.png'];
      const createdPost = { id: 1, user_id: userId, content, created_at: new Date().toISOString() };
      const createdImage = { id: 1, post_id: 1, image_url: image_urls[0], display_order: 0 };

      (postDAO.createPost as vi.Mock).mockReturnValue(createdPost);
      (postDAO.addImageToPost as vi.Mock).mockReturnValue(createdImage);

      const result = await postService.createPost(userId, content, image_urls);

      expect(postDAO.createPost).toHaveBeenCalledWith(db, userId, content);
      expect(postDAO.addImageToPost).toHaveBeenCalledWith(db, createdPost.id, image_urls[0], 0);
      expect(result).toEqual({ ...createdPost, images: [createdImage] });
    });
  });

  describe('deletePost', () => {
    it('should throw an error if user is not authorized to delete the post', async () => {
        const postId = 1;
        const userId = 2;
        const post = { id: postId, user_id: 1 };

        (postDAO.findPostById as vi.Mock).mockReturnValue(post);

        await expect(postService.deletePost(postId, userId)).rejects.toThrow('Unauthorized');
      });

      it('should delete the post if the user is authorized', async () => {
        const postId = 1;
        const userId = 1;
        const post = { id: postId, user_id: userId };

        (postDAO.findPostById as vi.Mock).mockReturnValue(post);
        (postDAO.deletePostById as vi.Mock).mockReturnValue(undefined);

        await postService.deletePost(postId, userId);

        expect(postDAO.deletePostById).toHaveBeenCalledWith(db, postId);
      });

      it('should throw an error if the post is not found', async () => {
        const postId = 1;
        const userId = 1;

        (postDAO.findPostById as vi.Mock).mockReturnValue(null);

        await expect(postService.deletePost(postId, userId)).rejects.toThrow('Post not found');
      });
  });
});
