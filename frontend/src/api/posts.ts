import apiClient from './client';

export const getPosts = async () => {
  const response = await apiClient.get('/posts');
  return response.data;
};

export const createPost = async (postData: { title: string; content: string; imageUrl: string }) => {
  const response = await apiClient.post('/posts', postData);
  return response.data;
};
