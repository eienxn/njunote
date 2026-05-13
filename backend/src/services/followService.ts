import { followDAO } from '../dao/followDAO.js';
import { AppError } from '../utils/AppError.js';

export class FollowService {
  async followUser(followerId: number, followingId: number) {
    if (followerId === followingId) {
        throw new AppError('You cannot follow yourself', 400);
    }
    const existingFollow = await followDAO.findFollow(followerId, followingId);
    if (existingFollow) {
      throw new AppError('You are already following this user', 400);
    }
    return followDAO.createFollow(followerId, followingId);
  }

  async unfollowUser(followerId: number, followingId: number) {
    const existingFollow = await followDAO.findFollow(followerId, followingId);
    if (!existingFollow) {
      throw new AppError('You are not following this user', 400);
    }
    await followDAO.deleteFollow(followerId, followingId);
  }

  async getFollowers(userId: number) {
    return followDAO.getFollowers(userId);
  }

  async getFollowing(userId: number) {
    return followDAO.getFollowing(userId);
  }
}

export const followService = new FollowService();
