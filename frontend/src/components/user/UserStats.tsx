import React from 'react';
import { UserStats as UserStatsType } from '../../api/users';

interface UserStatsProps {
  stats: UserStatsType;
}

export const UserStats: React.FC<UserStatsProps> = ({ stats }) => {
  return (
    <div className="flex gap-6 text-center">
      <div>
        <div className="text-2xl font-bold text-gray-900">{stats.postsCount}</div>
        <div className="text-sm text-gray-600">笔记</div>
      </div>
      <div>
        <div className="text-2xl font-bold text-gray-900">{stats.followingCount}</div>
        <div className="text-sm text-gray-600">关注</div>
      </div>
      <div>
        <div className="text-2xl font-bold text-gray-900">{stats.followersCount}</div>
        <div className="text-sm text-gray-600">粉丝</div>
      </div>
    </div>
  );
};
