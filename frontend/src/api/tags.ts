import { apiClient } from './client';

export interface Tag {
  id: number;
  name: string;
  created_at: number;
}

export interface TagWithCount extends Tag {
  count: number;
}

export interface Post {
  id: number;
  user_id: number;
  content: string;
  created_at: number;
  updated_at: number;
  author?: {
    id: number;
    nickname: string;
    avatar: string;
  };
  images?: string[];
  tags?: string[];
}

export const tagAPI = {
  /**
   * 获取热门标签
   */
  async getTrendingTags(limit: number = 10): Promise<TagWithCount[]> {
    const response = await apiClient.get(`/tags/trending?limit=${limit}`);
    return response.data.data;
  },

  /**
   * 获取某个标签下的笔记
   */
  async getPostsByTag(
    tagName: string,
    page: number = 1,
    pageSize: number = 20
  ): Promise<{
    posts: Post[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  }> {
    const response = await apiClient.get(
      `/tags/${encodeURIComponent(tagName)}/posts?page=${page}&pageSize=${pageSize}`
    );
    return response.data.data;
  },
};
