'use client';

import { useState } from 'react';
import { Header } from '../../components/Header';
import { LoadingSpinner, LoadingSkeleton } from '../../components/LoadingSpinner';
import { MinerProfileModal } from '../../components/MinerProfileModal';
import { useAllMinerScores, useTopMiners } from '../../hooks/useNuanceData';

export default function MinersPage() {
  const [selectedMinerHotkey, setSelectedMinerHotkey] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'score' | 'hotkey'>('score');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: allMinerScores, isLoading: isAllMinersLoading } = useAllMinerScores();
  const { data: topMiners } = useTopMiners('all', 100); // Get more top miners for better data matching

  const formatHotkey = (hotkey: string) => {
    return `${hotkey.slice(0, 8)}...${hotkey.slice(-8)}`;
  };

  const handleSort = (column: 'score' | 'hotkey') => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  const getSortedAndFilteredMiners = () => {
    if (!allMinerScores?.miner_scores) return [];

    let miners = allMinerScores.miner_scores.map((scoreData, index) => {
      // Try to find matching miner data from topMiners for better display info
      const matchingMiner = topMiners?.find(tm => tm.hotkey === scoreData.node_hotkey);
      
      return {
        ...scoreData,
        uid: matchingMiner?.uid || 0,
        handle: matchingMiner?.handle || scoreData.node_hotkey.slice(0, 8),
        hotkey: scoreData.node_hotkey,
        rank: index + 1,
        username: matchingMiner?.username || scoreData.node_hotkey.slice(0, 8),
        total_posts: matchingMiner?.total_posts || 0,
        total_interactions: matchingMiner?.total_interactions || 0,
        avg_score: scoreData.score,
        last_active: matchingMiner?.last_active || new Date().toISOString(),
        retweet_count: matchingMiner?.retweet_count || 0,
        reply_count: matchingMiner?.reply_count || 0,
        node_hotkey: scoreData.node_hotkey,
      };
    });

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      miners = miners.filter(miner => 
        miner.node_hotkey.toLowerCase().includes(query) ||
        miner.username.toLowerCase().includes(query) ||
        miner.handle.toLowerCase().includes(query)
      );
    }

    // Sort miners
    miners.sort((a, b) => {
      let compareValue = 0;
      
      if (sortBy === 'score') {
        compareValue = a.score - b.score;
      } else if (sortBy === 'hotkey') {
        compareValue = a.node_hotkey.localeCompare(b.node_hotkey);
      }
      
      return sortOrder === 'asc' ? compareValue : -compareValue;
    });

    return miners;
  };

  const sortedAndFilteredMiners = getSortedAndFilteredMiners();

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      
      <main className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">All Miners</h1>
          <p className="text-gray-400">
            Complete list of all {allMinerScores?.miner_scores.length || 0} miners with scoring data in the Nuance Network
          </p>
        </div>

        {/* Search and Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by hotkey, username, or handle..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-600"
            />
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <span className="text-gray-400">Sort by:</span>
            <button
              onClick={() => handleSort('score')}
              className={`px-3 py-2 rounded border ${
                sortBy === 'score' 
                  ? 'bg-white text-black border-white' 
                  : 'bg-gray-900 text-white border-gray-800 hover:border-gray-600'
              }`}
            >
              Score {sortBy === 'score' && (sortOrder === 'desc' ? '↓' : '↑')}
            </button>
            <button
              onClick={() => handleSort('hotkey')}
              className={`px-3 py-2 rounded border ${
                sortBy === 'hotkey' 
                  ? 'bg-white text-black border-white' 
                  : 'bg-gray-900 text-white border-gray-800 hover:border-gray-600'
              }`}
            >
              Hotkey {sortBy === 'hotkey' && (sortOrder === 'desc' ? '↓' : '↑')}
            </button>
          </div>
        </div>

        {/* Results count */}
        <div className="mb-4">
          <p className="text-sm text-gray-400">
            Showing {sortedAndFilteredMiners.length} of {allMinerScores?.miner_scores.length || 0} miners
          </p>
        </div>

        {/* Miners Table */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-lg overflow-hidden">
          {isAllMinersLoading ? (
            <div className="p-6">
              <LoadingSkeleton className="h-8 mb-4" />
              {Array.from({ length: 10 }).map((_, i) => (
                <LoadingSkeleton key={i} className="h-16 mb-2" />
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="text-left p-4 text-sm font-medium text-gray-400">#</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-400">Miner</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-400">Hotkey</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-400">Score</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-400">Posts</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-400">Interactions</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedAndFilteredMiners.map((miner, index) => (
                    <tr 
                      key={miner.node_hotkey} 
                      className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors"
                    >
                      <td className="p-4 text-sm text-gray-400">
                        {searchQuery ? index + 1 : sortBy === 'score' && sortOrder === 'desc' ? index + 1 : '—'}
                      </td>
                      <td className="p-4">
                        <div>
                          <p className="font-medium text-white">
                            {miner.username || miner.handle}
                          </p>
                          <p className="text-xs text-gray-500">
                            UID: {miner.uid || 'Unknown'}
                          </p>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <code className="text-xs bg-gray-800 px-2 py-1 rounded font-mono text-gray-300">
                            {formatHotkey(miner.node_hotkey)}
                          </code>
                          <button
                            onClick={() => navigator.clipboard.writeText(miner.node_hotkey)}
                            className="text-gray-500 hover:text-white transition-colors p-1 rounded hover:bg-gray-700"
                            title="Copy full hotkey"
                          >
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          </button>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="font-bold text-white">
                          {miner.score.toFixed(3)}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-gray-400">
                        {miner.total_posts}
                      </td>
                      <td className="p-4 text-sm text-gray-400">
                        {miner.total_interactions}
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => setSelectedMinerHotkey(miner.node_hotkey)}
                          className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
                        >
                          View Profile
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {sortedAndFilteredMiners.length === 0 && !isAllMinersLoading && (
                <div className="p-8 text-center">
                  <p className="text-gray-400">
                    {searchQuery ? `No miners found matching "${searchQuery}"` : 'No miners found'}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Miner Profile Modal */}
      {selectedMinerHotkey && (
        <MinerProfileModal
          hotkey={selectedMinerHotkey}
          isOpen={Boolean(selectedMinerHotkey)}
          onClose={() => setSelectedMinerHotkey(null)}
        />
      )}
    </div>
  );
}