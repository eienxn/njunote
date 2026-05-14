import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { UserProfileHeader } from '../components/user/UserProfileHeader';
import { UserTabs } from '../components/user/UserTabs';
import { PostGrid } from '../components/post/PostGrid';
import { userAPI, User, UserStats } from '../api/users';
import { useAuthStore } from '../store/authStore';

export const UserProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const currentUser = useAuthStore((state) => state.user);
  
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [activeTab, setActiveTab] = useState<'posts' | 'bookmarks'>('posts');
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const userId = parseInt(id || '0');
  const isOwnProfile = currentUser?.id === userId;

  useEffect(() => {
    if (userId) {
      loadUserData();
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      loadPosts();
    }
  }, [userId, activeTab]);

  const loadUserData = async () => {
    try {
      const [userData, statsData] = await Promise.all([
        userAPI.getUserProfile(userId),
        userAPI.getUserStats(userId),
      ]);
      setUser(userData);
      setStats(statsData);
    } catch (error) {
      console.error('Failed to load user data:', error);
    }
  };

  const loadPosts = async () => {
    try {
      setLoading(true);
      
      if (activeTab === 'posts') {
        const data = await userAPI.getUserPosts(userId, 1, 20);
        setPosts(data.posts);
      } else {
        const data = await userAPI.getUserBookmarks(userId, 1, 20);
        setPosts(data.posts);
      }
    } catch (error) {
      console.error('Failed to load posts:', error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  if (!user || !stats) {
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
        <UserProfileHeader
          user={user}
          stats={stats}
          isOwnProfile={isOwnProfile}
          onEditProfile={() => {
            // TODO: 打开编辑资料弹窗
            alert('编辑资料功能待实现');
          }}
        />

        <UserTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          showBookmarks={isOwnProfile}
        />

        {loading ? (
          <div className="text-center text-gray-500">加载中...</div>
        ) : posts.length === 0 ? (
          <div className="text-center text-gray-500 py-12">
            {activeTab === 'posts' ? '暂无笔记' : '暂无收藏'}
          </div>
        ) : (
          <PostGrid posts={posts} />
        )}
      </div>
    </Layout>
  );
};
