import React, { useEffect, useState } from 'react';
import { tagAPI, TagWithCount } from '../../api/tags';
import { useNavigate } from 'react-router-dom';

export const TrendingTags: React.FC = () => {
  const [tags, setTags] = useState<TagWithCount[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadTrendingTags();
  }, []);

  const loadTrendingTags = async () => {
    try {
      setLoading(true);
      const data = await tagAPI.getTrendingTags(10);
      setTags(data);
    } catch (error) {
      console.error('Failed to load trending tags:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTagClick = (tagName: string) => {
    navigate(`/tags/${encodeURIComponent(tagName)}`);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-lg font-semibold mb-4">热门话题</h3>
        <div className="text-gray-500 text-sm">加载中...</div>
      </div>
    );
  }

  if (tags.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold mb-4">热门话题</h3>
      <div className="space-y-2">
        {tags.map((tag) => (
          <div
            key={tag.id}
            onClick={() => handleTagClick(tag.name)}
            className="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer transition"
          >
            <span className="text-blue-600 font-medium">#{tag.name}</span>
            <span className="text-gray-500 text-sm">{tag.count} 篇</span>
          </div>
        ))}
      </div>
    </div>
  );
};
