import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PostContent } from './PostContent';

interface Post {
  id: number;
  user_id: number;
  content: string;
  created_at: number;
  author?: {
    id: number;
    nickname: string;
    avatar: string;
  };
  images?: string[];
}

interface PostCardProps {
  post: Post;
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/posts/${post.id}`);
  };

  return (
    <div
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition"
      onClick={handleClick}
    >
      {post.images && post.images.length > 0 && (
        <img
          src={post.images[0]}
          alt="Post"
          className="w-full object-cover"
          style={{ maxHeight: '300px' }}
        />
      )}
      <div className="p-4">
        <div className="flex items-center mb-2">
          <span className="text-2xl mr-2">{post.author?.avatar || '😀'}</span>
          <span className="font-medium text-gray-900">
            {post.author?.nickname || 'Unknown'}
          </span>
        </div>
        <div className="text-gray-700 text-sm line-clamp-3">
          <PostContent content={post.content} />
        </div>
      </div>
    </div>
  );
};

export default PostCard;
