import { apiClient } from './client';

export interface User {
  id: number;
  email: string;
  nickname: string;
  avatar: string;
  bio: string;
  created_at: number;
  updated_at: number;
}

export interface UserStats {
  postsCount: number;
  followingCount: number;
  followersCount: number;
}

export const userAPI = {
  /**
   * 获取用户资料
   */
  async getUserProfile(userId: number): Promise<User> {
    const response = await apiClient.get(`/users/${userId}`);
    return response.data.data;
  },

  /**
   * 获取用户发布的笔记
   */
  async getUserPosts(userId: number, page: number = 1, pageSize: number = 20) {
    const response = await apiClient.get(`/users/${userId}/posts?page=${page}&pageSize=${pageSize}`);
    return response.data.data;
  },

  /**
   * 获取用户收藏的笔记
   */
  async getUserBookmarks(userId: number, page: number = 1, pageSize: number = 20) {
    const response = await apiClient.get(`/users/${userId}/bookmarks?page=${page}&pageSize=${pageSize}`);
    return response.data.data;
  },

  /**
   * 获取用户统计信息
   */
  async getUserStats(userId: number): Promise<UserStats> {
    const response = await apiClient.get(`/users/${userId}/stats`);
    return response.data.data;
  },

  /**
   * 更新当前用户资料
   */
  async updateProfile(data: { nickname: string; avatar: string; bio: string }): Promise<User> {
    const response = await apiClient.put('/users/me', data);
    return response.data.data;
  },
};
