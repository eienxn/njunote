import React, { useEffect, useState } from 'react';
import { Layout } from '../components/layout/Layout';
import { PostGrid } from '../components/post/PostGrid';
import { TrendingTags } from '../components/tag/TrendingTags';

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

const HomePage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3000/api/posts');
      const data = await response.json();
      setPosts(data.posts || []);
    } catch (error) {
      console.error('Failed to load posts:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-6">
          {/* 主内容区 */}
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-6">发现</h1>
            {loading ? (
              <div className="text-center text-gray-500">加载中...</div>
            ) : posts.length === 0 ? (
              <div className="text-center text-gray-500 py-12">
                暂无笔记
              </div>
            ) : (
              <PostGrid posts={posts} />
            )}
          </div>

          {/* 侧边栏 */}
          <div className="w-80 flex-shrink-0">
            <TrendingTags />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
