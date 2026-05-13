import { likeDAO } from '../dao/likeDAO.js';
import { AppError } from '../utils/AppError.js';

export class LikeService {
  async likeNote(userId: number, noteId: number) {
    const existingLike = await likeDAO.findLike(userId, noteId);
    if (existingLike) {
      throw new AppError('You have already liked this note', 400);
    }
    return likeDAO.createLike(userId, noteId);
  }

  async unlikeNote(userId: number, noteId: number) {
    const existingLike = await likeDAO.findLike(userId, noteId);
    if (!existingLike) {
      throw new AppError('You have not liked this note', 400);
    }
    await likeDAO.deleteLike(userId, noteId);
  }

  async getLikesByNoteId(noteId: number) {
    return likeDAO.getLikesByNoteId(noteId);
  }

  async getLikeCountByNoteId(noteId: number) {
    return likeDAO.getLikeCountByNoteId(noteId);
  }
}

export const likeService = new LikeService();
