export interface AuthTokenPayload {
  userId: number;
  email: string;
}

export interface User {
  id: number;
  email: string;
  password?: string;
  nickname: string | null;
  avatar: string | null;
  bio: string | null;
}

export interface UserCreateInput {
  email: string;
  password?: string;
  nickname?: string;
  avatar?: string;
  bio?: string;
}

export interface Post {
    id: number;
    userId: number;
    content: string;
    imageUrl: string | null;
    createdAt: string;
}

export interface Like {
    id: number;
    userId: number;
    postId: number;
    createdAt: string;
}

export interface LikeCreateInput {
    userId: number;
    postId: number;
}

export interface Comment {
    id: number;
    userId: number;
    postId: number;
    content: string;
    createdAt: string;
}

export interface CommentCreateInput {
    userId: number;
    postId: number;
    content: string;
}

export interface Follow {
    id: number;
    followerId: number;
    followingId: number;
    createdAt: string;
}

export interface FollowCreateInput {
    followerId: number;
    followingId: number;
}
