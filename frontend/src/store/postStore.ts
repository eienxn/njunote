import create from 'zustand';
import { Post } from '../types/post';
import { getPosts, createPost as apiCreatePost } from '../api/posts';

interface PostState {
  posts: Post[];
  fetchPosts: () => Promise<void>;
  createPost: (postData: { title: string; content: string; imageUrl: string }) => Promise<void>;
}

export const usePostStore = create<PostState>((set) => ({
  posts: [],
  fetchPosts: async () => {
    const posts = await getPosts();
    set({ posts });
  },
  createPost: async (postData) => {
    await apiCreatePost(postData);
  },
}));
