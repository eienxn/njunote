import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LikeService } from '../../../src/services/likeService.js';
import { likeDAO } from '../../../src/dao/likeDAO.js';
import { AppError } from '../../../src/utils/AppError.js';

vi.mock('../../../src/dao/likeDAO.js');

describe('LikeService', () => {
  let likeService: LikeService;

  beforeEach(() => {
    likeService = new LikeService();
    vi.clearAllMocks();
  });

  describe('likeNote', () => {
    it('should allow a user to like a note', async () => {
      vi.mocked(likeDAO.findLike).mockResolvedValue(null);
      vi.mocked(likeDAO.createLike).mockResolvedValue({ id: 1, userId: 1, noteId: 1, createdAt: new Date() });

      const like = await likeService.likeNote(1, 1);
      expect(like).toBeDefined();
      expect(likeDAO.createLike).toHaveBeenCalledWith(1, 1);
    });

    it('should throw an error if the user has already liked the note', async () => {
      vi.mocked(likeDAO.findLike).mockResolvedValue({ id: 1, userId: 1, noteId: 1, createdAt: new Date() });
      await expect(likeService.likeNote(1, 1)).rejects.toThrow(new AppError('You have already liked this note', 400));
    });
  });

  describe('unlikeNote', () => {
    it('should allow a user to unlike a note', async () => {
      vi.mocked(likeDAO.findLike).mockResolvedValue({ id: 1, userId: 1, noteId: 1, createdAt: new Date() });
      vi.mocked(likeDAO.deleteLike).mockResolvedValue(undefined);

      await likeService.unlikeNote(1, 1);
      expect(likeDAO.deleteLike).toHaveBeenCalledWith(1, 1);
    });

    it('should throw an error if the user has not liked the note', async () => {
      vi.mocked(likeDAO.findLike).mockResolvedValue(null);
      await expect(likeService.unlikeNote(1, 1)).rejects.toThrow(new AppError('You have not liked this note', 400));
    });
  });

  describe('getLikesByNoteId', () => {
    it('should return all likes for a given note', async () => {
        const likes = [{ id: 1, userId: 1, noteId: 1, createdAt: new Date() }];
        vi.mocked(likeDAO.getLikesByNoteId).mockResolvedValue(likes);
        const result = await likeService.getLikesByNoteId(1);
        expect(result).toEqual(likes);
        expect(likeDAO.getLikesByNoteId).toHaveBeenCalledWith(1);
    });
  });

  describe('getLikeCountByNoteId', () => {
    it('should return the number of likes for a given note', async () => {
        vi.mocked(likeDAO.getLikeCountByNoteId).mockResolvedValue(10);
        const count = await likeService.getLikeCountByNoteId(1);
        expect(count).toBe(10);
        expect(likeDAO.getLikeCountByNoteId).toHaveBeenCalledWith(1);
    });
  });
});
