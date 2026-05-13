import apiClient from './client';
import { User } from '../types/user';

export const login = async (credentials: Pick<User, 'email' | 'password'>) => {
  const response = await apiClient.post('/auth/login', credentials);
  return response.data;
};

export const register = async (userData: Omit<User, 'id'>) => {
  const response = await apiClient.post('/auth/register', userData);
  return response.data;
};
