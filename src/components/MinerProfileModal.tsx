'use client';

import { useEnhancedMinerProfile } from '../hooks/useNuanceData';
import { LoadingSpinner, LoadingSkeleton } from './LoadingSpinner';
import { ScoreBreakdown } from './ScoreBreakdown';
import { VerificationBadge } from './VerificationBadge';

interface MinerProfileModalProps {
  hotkey: string;
  onClose: () => void;
  isOpen: boolean;
}

export function MinerProfileModal({ hotkey, onClose, isOpen }: MinerProfileModalProps) {
  const { data: profile, isLoading, error } = useEnhancedMinerProfile(hotkey, isOpen);

  if (!isOpen) return null;

  const formatHotkey = (hotkey: string) => {
    return `${hotkey.slice(0, 8)}...${hotkey.slice(-8)}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gray-900 border-b border-gray-800 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Miner Profile</h2>
            <p className="text-gray-400 font-mono text-sm">{formatHotkey(hotkey)}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {isLoading ? (
            <div className="space-y-6">
              <LoadingSkeleton className="h-32" />
              <LoadingSkeleton className="h-48" />
              <LoadingSkeleton className="h-64" />
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-400">Failed to load miner profile</p>
            </div>
          ) : profile ? (
            <div className="space-y-6">
              {/* Basic Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                  <h3 className="text-sm text-gray-400 mb-1">Verified Accounts</h3>
                  <p className="text-2xl font-bold text-white">{profile.stats.account_count}</p>
                </div>
                <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                  <h3 className="text-sm text-gray-400 mb-1">Total Posts</h3>
                  <p className="text-2xl font-bold text-white">{profile.stats.post_count}</p>
                </div>
                <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                  <h3 className="text-sm text-gray-400 mb-1">Total Interactions</h3>
                  <p className="text-2xl font-bold text-white">{profile.stats.interaction_count}</p>
                </div>
              </div>

              {/* Score Breakdown */}
              {profile.scoreBreakdown && (
                <ScoreBreakdown breakdown={profile.scoreBreakdown} />
              )}

              {/* Social Accounts */}
              {profile.socialAccounts.length > 0 && (
                <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Verified Accounts</h3>
                  <div className="space-y-3">
                    {profile.socialAccounts.map((account, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-2">
                            <span className="text-blue-400">@{account.username}</span>
                            <VerificationBadge 
                              platformType={account.platform_type} 
                              accountId={account.account_id}
                            />
                          </div>
                          <span className="text-xs text-gray-500 capitalize">
                            {account.platform_type}
                          </span>
                        </div>
                        {account.extra_data?.followers_count && (
                          <span className="text-xs text-gray-400">
                            {account.extra_data.followers_count.toLocaleString()} followers
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recent Posts */}
              {profile.recentPosts.length > 0 && (
                <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Recent Posts</h3>
                  <div className="space-y-3">
                    {profile.recentPosts.slice(0, 5).map((post, index) => (
                      <div key={index} className="p-3 bg-gray-800/50 rounded-lg">
                        <p className="text-gray-300 text-sm mb-2 line-clamp-2">
                          {post.content || post.text}
                        </p>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-500">
                            {formatDate(post.created_at || post.date)}
                          </span>
                          <div className="flex items-center space-x-2">
                            {post.interactions_count && (
                              <span className="text-gray-400">
                                💬 {post.interactions_count}
                              </span>
                            )}
                            {post.score && (
                              <span className="text-gray-400">
                                Score: {post.score}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recent Interactions */}
              {profile.recentInteractions.length > 0 && (
                <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Recent Interactions</h3>
                  <div className="space-y-3">
                    {profile.recentInteractions.slice(0, 5).map((interaction, index) => (
                      <div key={index} className="p-3 bg-gray-800/50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-gray-400 capitalize">
                            {interaction.interaction_type}
                          </span>
                          <span className="text-xs text-gray-500">
                            {formatDate(interaction.created_at)}
                          </span>
                        </div>
                        {interaction.content && (
                          <p className="text-gray-300 text-sm line-clamp-2">
                            {interaction.content}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}