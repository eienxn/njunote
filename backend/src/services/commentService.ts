import { commentDAO } from '../dao/commentDAO.js';
import { AppError } from '../utils/AppError.js';

export class CommentService {
  async addComment(userId: number, noteId: number, content: string) {
    if (!content || content.trim() === '') {
      throw new AppError('Comment content cannot be empty', 400);
    }
    const commentData = { userId, noteId, content };
    return commentDAO.createComment(commentData);
  }

  async deleteComment(commentId: number, userId: number) {
    const comment = await commentDAO.getCommentById(commentId);
    if (!comment) {
      throw new AppError('Comment not found', 404);
    }
    if (comment.userId !== userId) {
      throw new AppError('You are not authorized to delete this comment', 403);
    }
    await commentDAO.deleteComment(commentId);
  }

  async getCommentsByNoteId(noteId: number) {
    return commentDAO.getCommentsByNoteId(noteId);
  }
}

export const commentService = new CommentService();
