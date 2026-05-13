import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CommentService } from '../../../src/services/commentService.js';
import { commentDAO } from '../../../src/dao/commentDAO.js';
import { AppError } from '../../../src/utils/AppError.js';

vi.mock('../../../src/dao/commentDAO.js');

describe('CommentService', () => {
  let commentService: CommentService;

  beforeEach(() => {
    commentService = new CommentService();
    vi.clearAllMocks();
  });

  describe('addComment', () => {
    it('should add a comment to a note', async () => {
      const commentData = { userId: 1, noteId: 1, content: 'Test comment' };
      const newComment = { id: 1, ...commentData, createdAt: new Date(), updatedAt: new Date() };
      vi.mocked(commentDAO.createComment).mockResolvedValue(newComment);

      const result = await commentService.addComment(commentData.userId, commentData.noteId, commentData.content);
      expect(result).toEqual(newComment);
      expect(commentDAO.createComment).toHaveBeenCalledWith(commentData);
    });

     it('should throw an error if content is empty', async () => {
      await expect(commentService.addComment(1, 1, ' ')).rejects.toThrow(new AppError('Comment content cannot be empty', 400));
    });
  });

  describe('deleteComment', () => {
    it('should delete a comment', async () => {
      const comment = { id: 1, userId: 1, noteId: 1, content: "test", createdAt: new Date(), updatedAt: new Date() };
      vi.mocked(commentDAO.getCommentById).mockResolvedValue(comment);
      vi.mocked(commentDAO.deleteComment).mockResolvedValue(undefined);

      await commentService.deleteComment(1, 1);
      expect(commentDAO.deleteComment).toHaveBeenCalledWith(1);
    });

    it('should throw an error if comment not found', async () => {
        vi.mocked(commentDAO.getCommentById).mockResolvedValue(null);
        await expect(commentService.deleteComment(1, 1)).rejects.toThrow(new AppError('Comment not found', 404));
    });

    it('should throw an error if user is not the owner of the comment', async () => {
      const comment = { id: 1, userId: 2, noteId: 1, content: "test", createdAt: new Date(), updatedAt: new Date() };
      vi.mocked(commentDAO.getCommentById).mockResolvedValue(comment);
      await expect(commentService.deleteComment(1, 1)).rejects.toThrow(new AppError('You are not authorized to delete this comment', 403));
    });
  });

  describe('getCommentsByNoteId', () => {
    it('should return comments for a note', async () => {
        const comments = [{ id: 1, userId: 1, noteId: 1, content: 'Test comment', createdAt: new Date(), updatedAt: new Date() }];
        vi.mocked(commentDAO.getCommentsByNoteId).mockResolvedValue(comments);
        const result = await commentService.getCommentsByNoteId(1);
        expect(result).toEqual(comments);
        expect(commentDAO.getCommentsByNoteId).toHaveBeenCalledWith(1);
    });
  });
});
