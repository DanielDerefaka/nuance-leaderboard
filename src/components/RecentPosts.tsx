'use client';

import { useState } from 'react';
import { useRecentPosts } from '../hooks/useNuanceData';
import { LoadingSpinner, LoadingSkeleton } from './LoadingSpinner';
import { PostVerificationResponse } from '../types/nuance';

export function RecentPosts() {
  const [filters, setFilters] = useState({
    limit: 20,
    min_interactions: 1,
    only_scored: true,
    include_stats: true,
  });

  const { data: posts, isLoading, error } = useRecentPosts('twitter', filters);

  if (error) {
    return (
      <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
        <p className="text-red-400">Failed to load recent posts</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Recent Posts</h2>
        
        {/* Filter Controls */}
        <div className="flex items-center space-x-4 text-sm">
          <label className="text-gray-400">
            Min Interactions:
            <select
              value={filters.min_interactions}
              onChange={(e) => setFilters({ ...filters, min_interactions: Number(e.target.value) })}
              className="ml-2 bg-gray-800 border border-gray-700 rounded px-2 py-1 text-white"
            >
              <option value={0}>Any</option>
              <option value={1}>1+</option>
              <option value={5}>5+</option>
              <option value={10}>10+</option>
            </select>
          </label>
          
          <label className="text-gray-400 flex items-center">
            <input
              type="checkbox"
              checked={filters.only_scored}
              onChange={(e) => setFilters({ ...filters, only_scored: e.target.checked })}
              className="mr-2"
            />
            Only Scored
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <LoadingSkeleton key={i} className="h-48" />
          ))
        ) : (
          posts?.map((post) => (
            <RecentPostCard key={post.post_id} post={post} />
          ))
        )}
      </div>

      {posts && posts.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-400">No recent posts found with current filters</p>
        </div>
      )}
    </div>
  );
}

function RecentPostCard({ post }: { post: PostVerificationResponse }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted': return 'text-green-400 bg-green-400/10';
      case 'rejected': return 'text-red-400 bg-red-400/10';
      case 'new': return 'text-blue-400 bg-blue-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4 hover:border-gray-700 transition-colors">
      <div className="mb-3">
        <p className="text-gray-300 text-sm leading-relaxed line-clamp-3">
          {post.content}
        </p>
      </div>

      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2 text-xs">
          <span className="text-gray-400">@{post.username || 'unknown'}</span>
          <span className="text-gray-500">•</span>
          <span className="text-gray-500">{formatDate(post.created_at)}</span>
        </div>
        
        <span className={`px-2 py-1 rounded text-xs ${getStatusColor(post.processing_status)}`}>
          {post.processing_status}
        </span>
      </div>

      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center space-x-3">
          <span className="text-gray-400">💬 {post.interaction_count}</span>
          {post.stats && (
            <>
              {post.stats.like_count && (
                <span className="text-gray-400">❤️ {post.stats.like_count}</span>
              )}
              {post.stats.retweet_count && (
                <span className="text-gray-400">🔁 {post.stats.retweet_count}</span>
              )}
            </>
          )}
        </div>
        
        {post.topics.length > 0 && (
          <div className="flex items-center space-x-1">
            {post.topics.slice(0, 2).map((topic, index) => (
              <span key={index} className="px-2 py-1 bg-gray-800 text-gray-300 rounded text-xs">
                {topic}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}