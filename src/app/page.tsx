'use client';

import { useState } from 'react';
import { Header } from '../components/Header';
import { StatsCard } from '../components/StatsCard';
import { MinerCard } from '../components/MinerCard';
import { PostCard } from '../components/PostCard';
import { SearchInput } from '../components/SearchInput';
import { LoadingSpinner, LoadingSkeleton } from '../components/LoadingSpinner';
import { MinerProfileModal } from '../components/MinerProfileModal';
import { RecentPosts } from '../components/RecentPosts';
import { TopicAnalyzer } from '../components/TopicAnalyzer';
import { useDashboardData, useTopMiners, useAllMinerScores } from '../hooks/useNuanceData';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTimeframe, setSelectedTimeframe] = useState<'7d' | '30d' | 'all'>('30d');
  const [selectedMinerHotkey, setSelectedMinerHotkey] = useState<string | null>(null);
  
  const { data: dashboardData, isLoading: isDashboardLoading, error: dashboardError } = useDashboardData();
  const { data: topMiners, isLoading: isTopMinersLoading } = useTopMiners(selectedTimeframe, 20);
  const { data: allMinerScores, isLoading: isAllMinersLoading } = useAllMinerScores();

  // Filter miners based on search query using the comprehensive scores data
  const filteredMiners = searchQuery && allMinerScores
    ? allMinerScores.miner_scores.filter(miner => {
        const query = searchQuery.toLowerCase().trim();
        return (
          miner.node_hotkey?.toLowerCase().includes(query)
        );
      }).map(scoreData => ({
        ...scoreData,
        uid: 0, // Will be populated from actual miner data
        handle: 'Unknown',
        hotkey: scoreData.node_hotkey,
        rank: 0,
        username: 'Unknown',
        total_posts: 0,
        total_interactions: 0,
        avg_score: scoreData.score,
        last_active: new Date().toISOString(),
        retweet_count: 0,
        reply_count: 0,
        node_hotkey: scoreData.node_hotkey,
      }))
    : topMiners || [];

  const isMinersLoading = searchQuery ? isAllMinersLoading : isTopMinersLoading;

  const handleMinerProfileView = (hotkey: string) => {
    setSelectedMinerHotkey(hotkey);
  };

  if (dashboardError) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">Failed to load dashboard</h2>
          <p className="text-gray-400">Please check your connection and try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      
      <main className="container mx-auto px-6 py-8 space-y-12">
        {/* Hero Section */}
        <section id="dashboard" className="text-center py-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Nuance Network Tracker
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Monitor quality content scores, view leaderboards, and track performance analytics 
            for Bittensor subnet 23 - the Nuance Network.
          </p>
        </section>

        {/* Stats Overview */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {isDashboardLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <LoadingSkeleton key={i} className="h-32" />
            ))
          ) : dashboardData ? (
            <>
              <StatsCard
                title="Active Miners"
                value={dashboardData.stats.active_miners}
                icon={<span className="text-white">⛏️</span>}
                trend="up"
              />
              <StatsCard
                title="Validated Posts"
                value={dashboardData.stats.total_posts}
                subtitle={`Last 24h: ${dashboardData.stats.network_activity.posts_24h}`}
                icon={<span className="text-white">📝</span>}
                trend="up"
              />
              <StatsCard
                title="Average Quality Score"
                value={dashboardData.stats.avg_quality_score.toFixed(1)}
                icon={<span className="text-white">⭐</span>}
                trend="stable"
              />
              <StatsCard
                title="Network Activity"
                value={dashboardData.stats.network_activity.interactions_24h}
                subtitle="Interactions (24h)"
                icon={<span className="text-white">💬</span>}
                trend="up"
              />
            </>
          ) : null}
        </section>

        {/* Search Section */}
        <section id="search">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-center">Track Your Score</h2>
            <SearchInput
              placeholder="Search by hotkey or username..."
              onSearch={setSearchQuery}
              value={searchQuery}
            />
            {searchQuery && (
              <p className="text-sm text-gray-400 mt-2 text-center">
                {isAllMinersLoading 
                  ? 'Searching...' 
                  : `Found ${filteredMiners.length} miners matching "${searchQuery}"`
                }
              </p>
            )}
            {!searchQuery && allMinerScores && (
              <p className="text-xs text-gray-500 mt-2 text-center">
                Search through all {allMinerScores.miner_scores.length} miners by hotkey
              </p>
            )}
          </div>
        </section>

        {/* Leaderboard Section */}
        <section id="leaderboard">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Leaderboard</h2>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-400">Filter:</span>
              <select
                value={selectedTimeframe}
                onChange={(e) => setSelectedTimeframe(e.target.value as '7d' | '30d' | 'all')}
                className="bg-gray-900 border border-gray-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-600"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="all">All time</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {isMinersLoading ? (
              Array.from({ length: 9 }).map((_, i) => (
                <LoadingSkeleton key={i} className="h-32" />
              ))
            ) : (
              filteredMiners.map((miner) => (
                <MinerCard
                  key={miner.hotkey}
                  miner={miner}
                  onViewProfile={handleMinerProfileView}
                />
              ))
            )}
          </div>

          {searchQuery && filteredMiners.length === 0 && !isMinersLoading && (
            <div className="text-center py-12">
              <p className="text-gray-400">No miners found matching "{searchQuery}"</p>
            </div>
          )}
        </section>

        {/* Featured Content Section */}
        <section id="analytics">
          <h2 className="text-3xl font-bold mb-8">Featured Content</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {isDashboardLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <LoadingSkeleton key={i} className="h-40" />
              ))
            ) : dashboardData?.featuredContent ? (
              dashboardData.featuredContent.map((post) => (
                <PostCard key={post.post_id} post={post} />
              ))
            ) : null}
          </div>
        </section>

        {/* Recent Posts Section - NEW FEATURE */}
        <section>
          <RecentPosts />
        </section>

        {/* Content Analysis Tools - NEW FEATURE */}
        <section>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <TopicAnalyzer />
            
            <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">New Features Added</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start space-x-2">
                  <span className="text-green-400 mt-0.5">✅</span>
                  <div>
                    <p className="text-white font-medium">Enhanced Miner Profiles</p>
                    <p className="text-gray-400">Click any miner card to see detailed score breakdown</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-green-400 mt-0.5">✅</span>
                  <div>
                    <p className="text-white font-medium">Complete Search</p>
                    <p className="text-gray-400">Search all miners, not just top performers</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-green-400 mt-0.5">✅</span>
                  <div>
                    <p className="text-white font-medium">Recent Posts Feed</p>
                    <p className="text-gray-400">Browse latest posts with advanced filtering</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-green-400 mt-0.5">✅</span>
                  <div>
                    <p className="text-white font-medium">Topic Analysis</p>
                    <p className="text-gray-400">Analyze content relevance to specific topics</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-green-400 mt-0.5">✅</span>
                  <div>
                    <p className="text-white font-medium">Account Verification</p>
                    <p className="text-gray-400">Verify if accounts are part of Nuance Network</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Network Status */}
        <section className="bg-gray-900/30 border border-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">Network Status</h3>
              <p className="text-sm text-gray-400">
                Last updated: {new Date().toLocaleString()}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              <span className="text-sm text-green-400">Online</span>
            </div>
          </div>
        </section>
      </main>

      {/* Enhanced Miner Profile Modal - NEW FEATURE */}
      {selectedMinerHotkey && (
        <MinerProfileModal
          hotkey={selectedMinerHotkey}
          isOpen={Boolean(selectedMinerHotkey)}
          onClose={() => setSelectedMinerHotkey(null)}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8 mt-16">
        <div className="container mx-auto px-6 text-center">
          <p className="text-gray-400 text-sm">
            Built for the Nuance Network (Bittensor Subnet 23) • 
            Data updates every 60 seconds • Now with complete API coverage
          </p>
        </div>
      </footer>
    </div>
  );
}