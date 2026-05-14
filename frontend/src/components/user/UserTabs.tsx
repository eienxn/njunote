import React from 'react';

interface UserTabsProps {
  activeTab: 'posts' | 'bookmarks';
  onTabChange: (tab: 'posts' | 'bookmarks') => void;
  showBookmarks: boolean;
}

export const UserTabs: React.FC<UserTabsProps> = ({
  activeTab,
  onTabChange,
  showBookmarks,
}) => {
  return (
    <div className="border-b border-gray-200 mb-6">
      <div className="flex gap-8">
        <button
          onClick={() => onTabChange('posts')}
          className={`pb-4 px-2 font-medium transition ${
            activeTab === 'posts'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          笔记
        </button>
        
        {showBookmarks && (
          <button
            onClick={() => onTabChange('bookmarks')}
            className={`pb-4 px-2 font-medium transition ${
              activeTab === 'bookmarks'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            收藏
          </button>
        )}
      </div>
    </div>
  );
};
