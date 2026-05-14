import React, { useState } from 'react';
import { User, UserStats as UserStatsType } from '../../api/users';
import { UserStats } from './UserStats';

interface UserProfileHeaderProps {
  user: User;
  stats: UserStatsType;
  isOwnProfile: boolean;
  onEditProfile?: () => void;
  onFollow?: () => void;
  onUnfollow?: () => void;
  isFollowing?: boolean;
}

export const UserProfileHeader: React.FC<UserProfileHeaderProps> = ({
  user,
  stats,
  isOwnProfile,
  onEditProfile,
  onFollow,
  onUnfollow,
  isFollowing = false,
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <div className="flex items-start gap-6">
        {/* 头像 */}
        <div className="text-6xl">{user.avatar}</div>

        {/* 用户信息 */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">{user.nickname}</h1>
            
            {isOwnProfile ? (
              <button
                onClick={onEditProfile}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                编辑资料
              </button>
            ) : (
              <button
                onClick={isFollowing ? onUnfollow : onFollow}
                className={`px-4 py-2 rounded-lg ${
                  isFollowing
                    ? 'border border-gray-300 hover:bg-gray-50'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {isFollowing ? '已关注' : '关注'}
              </button>
            )}
          </div>

          {/* 简介 */}
          {user.bio && (
            <p className="text-gray-700 mb-4">{user.bio}</p>
          )}

          {/* 统计信息 */}
          <UserStats stats={stats} />
        </div>
      </div>
    </div>
  );
};
