import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FollowService } from '../../../src/services/followService.js';
import { followDAO } from '../../../src/dao/followDAO.js';
import { AppError } from '../../../src/utils/AppError.js';

vi.mock('../../../src/dao/followDAO.js');

describe('FollowService', () => {
  let followService: FollowService;

  beforeEach(() => {
    followService = new FollowService();
    vi.clearAllMocks();
  });

  describe('followUser', () => {
    it('should allow a user to follow another user', async () => {
      vi.mocked(followDAO.findFollow).mockResolvedValue(null);
      vi.mocked(followDAO.createFollow).mockResolvedValue({ id: 1, followerId: 1, followingId: 2, createdAt: new Date() });

      const follow = await followService.followUser(1, 2);
      expect(follow).toBeDefined();
      expect(followDAO.createFollow).toHaveBeenCalledWith(1, 2);
    });

    it('should throw an error if user tries to follow themselves', async () => {
        await expect(followService.followUser(1, 1)).rejects.toThrow(new AppError('You cannot follow yourself', 400));
    });

    it('should throw an error if the user is already following the target user', async () => {
      vi.mocked(followDAO.findFollow).mockResolvedValue({ id: 1, followerId: 1, followingId: 2, createdAt: new Date() });
      await expect(followService.followUser(1, 2)).rejects.toThrow(new AppError('You are already following this user', 400));
    });
  });

  describe('unfollowUser', () => {
    it('should allow a user to unfollow another user', async () => {
      vi.mocked(followDAO.findFollow).mockResolvedValue({ id: 1, followerId: 1, followingId: 2, createdAt: new Date() });
      vi.mocked(followDAO.deleteFollow).mockResolvedValue(undefined);

      await followService.unfollowUser(1, 2);
      expect(followDAO.deleteFollow).toHaveBeenCalledWith(1, 2);
    });

    it('should throw an error if the user is not following the target user', async () => {
      vi.mocked(followDAO.findFollow).mockResolvedValue(null);
      await expect(followService.unfollowUser(1, 2)).rejects.toThrow(new AppError('You are not following this user', 400));
    });
  });

  describe('getFollowers', () => {
    it('should return a list of followers for a user', async () => {
      const followers = [{ id: 1, followerId: 2, followingId: 1, createdAt: new Date() }];
      vi.mocked(followDAO.getFollowers).mockResolvedValue(followers);
      const result = await followService.getFollowers(1);
      expect(result).toEqual(followers);
      expect(followDAO.getFollowers).toHaveBeenCalledWith(1);
    });
  });

  describe('getFollowing', () => {
    it('should return a list of users a user is following', async () => {
      const following = [{ id: 1, followerId: 1, followingId: 2, createdAt: new Date() }];
      vi.mocked(followDAO.getFollowing).mockResolvedValue(following);
      const result = await followService.getFollowing(1);
      expect(result).toEqual(following);
      expect(followDAO.getFollowing).toHaveBeenCalledWith(1);
    });
  });
});
