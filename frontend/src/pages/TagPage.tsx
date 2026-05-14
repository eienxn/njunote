import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { tagAPI, Post } from '../api/tags';
import { PostGrid } from '../components/post/PostGrid';
import { Layout } from '../components/layout/Layout';

export const TagPage: React.FC = () => {
  const { name } = useParams<{ name: string }>();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (name) {
      loadPosts();
    }
  }, [name, page]);

  const loadPosts = async () => {
    if (!name) return;

    try {
      setLoading(true);
      const data = await tagAPI.getPostsByTag(decodeURIComponent(name), page, 20);
      setPosts(data.posts);
      setTotal(data.total);
    } catch (error) {
      console.error('Failed to load posts:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading && page === 1) {
    return (
      <Layout>
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center text-gray-500">加载中...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            #{name}
          </h1>
          <p className="text-gray-600 mt-2">{total} 篇笔记</p>
        </div>

        {posts.length === 0 ? (
          <div className="text-center text-gray-500 py-12">
            暂无相关笔记
          </div>
        ) : (
          <PostGrid posts={posts} />
        )}

        {total > page * 20 && (
          <div className="text-center mt-8">
            <button
              onClick={() => setPage(page + 1)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? '加载中...' : '加载更多'}
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
};
