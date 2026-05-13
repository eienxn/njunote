import React from 'react';
import { Post } from '../../types/post';

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <img src={post.imageUrl} alt={post.title} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="text-lg font-bold">{post.title}</h3>
        <p className="text-gray-600">{post.content}</p>
      </div>
    </div>
  );
};

export default PostCard;
