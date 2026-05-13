export interface User {
  id: number;
  email: string;
  password: string;
  nickname: string;
  avatar: string;
  bio: string;
  created_at: string;
}

export interface UserCreateInput {
  email: string;
  password: string;
  nickname: string;
  avatar?: string;
  bio?: string;
}

export interface UserPublic {
  id: number;
  email: string;
  nickname: string;
  avatar: string;
  bio: string;
  created_at: string;
}

export interface AuthTokenPayload {
  userId: number;
  email: string;
}

export interface AuthResponse {
  user: UserPublic;
  token: string;
}
