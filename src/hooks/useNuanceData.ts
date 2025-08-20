'use client';

import { useQuery, useQueries } from '@tanstack/react-query';
import { nuanceAPI } from '../lib/api';
import type { DashboardData, MinerProfile, MinerStats } from '../types/nuance';

// Dashboard data hook
export function useDashboardData() {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: async (): Promise<DashboardData> => {
      const [subnetStats, topMiners, topPosts] = await Promise.all([
        nuanceAPI.getSubnetStats(),
        nuanceAPI.getTopMiners('30d', 10),
        nuanceAPI.getTopPosts('top', 10)
      ]);

      return {
        stats: subnetStats,
        leaderboard: topMiners,
        featuredContent: topPosts
      };
    },
    staleTime: 30000, // 30 seconds
    refetchInterval: 60000, // Refetch every minute
  });
}

// Top miners hook
export function useTopMiners(timeframe?: '7d' | '30d' | 'all', limit: number = 50) {
  return useQuery({
    queryKey: ['topMiners', timeframe, limit],
    queryFn: () => nuanceAPI.getTopMiners(timeframe, limit),
    staleTime: 30000,
    refetchInterval: 60000,
  });
}

// All miners hook (for search)
export function useAllMiners(timeframe?: '7d' | '30d' | 'all') {
  return useQuery({
    queryKey: ['allMiners', timeframe],
    queryFn: () => nuanceAPI.getAllMiners(timeframe),
    staleTime: 60000, // Cache longer since it's a larger dataset
    refetchInterval: 300000, // Refetch every 5 minutes
  });
}

// Individual miner profile hook
export function useMinerProfile(hotkey: string, enabled: boolean = true) {
  return useQuery({
    queryKey: ['minerProfile', hotkey],
    queryFn: async (): Promise<MinerProfile> => {
      const [stats, accounts, posts, interactions] = await Promise.all([
        nuanceAPI.getMinerStats(hotkey),
        nuanceAPI.getMinerAccounts(hotkey),
        nuanceAPI.getMinerPosts(hotkey, 1, 10),
        nuanceAPI.getMinerInteractions(hotkey, 1)
      ]);

      return {
        stats,
        socialAccounts: accounts,
        recentPosts: posts,
        recentInteractions: interactions
      };
    },
    enabled,
    staleTime: 30000,
    refetchInterval: 60000,
  });
}

// Subnet stats hook
export function useSubnetStats() {
  return useQuery({
    queryKey: ['subnetStats'],
    queryFn: () => nuanceAPI.getSubnetStats(),
    staleTime: 30000,
    refetchInterval: 60000,
  });
}

// Top posts hook
export function useTopPosts(filter?: 'recent' | 'top' | 'trending', limit: number = 50) {
  return useQuery({
    queryKey: ['topPosts', filter, limit],
    queryFn: () => nuanceAPI.getTopPosts(filter, limit),
    staleTime: 30000,
    refetchInterval: 60000,
  });
}

// Miner search hook (client-side filtering for now)
export function useMinerSearch(query: string, miners: MinerStats[]) {
  return useQuery({
    queryKey: ['minerSearch', query],
    queryFn: () => {
      if (!query) return [];
      
      const lowerQuery = query.toLowerCase();
      return miners.filter(miner => 
        miner.username?.toLowerCase().includes(lowerQuery) ||
        miner.hotkey?.toLowerCase().includes(lowerQuery)
      );
    },
    enabled: Boolean(query && miners.length > 0),
    staleTime: Infinity, // Client-side filtering doesn't need refetch
  });
}

// NEW HOOKS FOR MISSING ENDPOINTS

// All miner scores hook (better search capability)
export function useAllMinerScores() {
  return useQuery({
    queryKey: ['allMinerScores'],
    queryFn: () => nuanceAPI.getAllMinerScores(),
    staleTime: 60000, // 1 minute
    refetchInterval: 300000, // 5 minutes
  });
}

// Miner score breakdown hook
export function useMinerScoreBreakdown(hotkey: string, enabled: boolean = true) {
  return useQuery({
    queryKey: ['minerScoreBreakdown', hotkey],
    queryFn: () => nuanceAPI.getMinerScoreBreakdown(hotkey),
    enabled: enabled && Boolean(hotkey),
    staleTime: 60000,
    refetchInterval: 300000,
  });
}

// Recent posts hook
export function useRecentPosts(
  platformType: string = 'twitter',
  params?: {
    cutoff_date?: string;
    skip?: number;
    limit?: number;
    min_interactions?: number;
    only_scored?: boolean;
    include_stats?: boolean;
  }
) {
  return useQuery({
    queryKey: ['recentPosts', platformType, params],
    queryFn: () => nuanceAPI.getRecentPosts(platformType, params),
    staleTime: 30000,
    refetchInterval: 60000,
  });
}

// Individual post hook
export function usePost(platformType: string = 'twitter', postId: string, includeStats: boolean = false, enabled: boolean = true) {
  return useQuery({
    queryKey: ['post', platformType, postId, includeStats],
    queryFn: () => nuanceAPI.getPost(platformType, postId, includeStats),
    enabled: enabled && Boolean(postId),
    staleTime: 60000,
    refetchInterval: 300000,
  });
}

// Post interactions hook
export function usePostInteractions(
  platformType: string = 'twitter',
  postId: string,
  skip: number = 0,
  limit: number = 20,
  enabled: boolean = true
) {
  return useQuery({
    queryKey: ['postInteractions', platformType, postId, skip, limit],
    queryFn: () => nuanceAPI.getPostInteractions(platformType, postId, skip, limit),
    enabled: enabled && Boolean(postId),
    staleTime: 30000,
    refetchInterval: 120000,
  });
}

// Recent interactions hook
export function useRecentInteractions(
  platformType: string = 'twitter',
  params?: {
    cutoff_date?: string;
    skip?: number;
    limit?: number;
  }
) {
  return useQuery({
    queryKey: ['recentInteractions', platformType, params],
    queryFn: () => nuanceAPI.getRecentInteractions(platformType, params),
    staleTime: 30000,
    refetchInterval: 60000,
  });
}

// Individual interaction hook
export function useInteraction(platformType: string = 'twitter', interactionId: string, enabled: boolean = true) {
  return useQuery({
    queryKey: ['interaction', platformType, interactionId],
    queryFn: () => nuanceAPI.getInteraction(platformType, interactionId),
    enabled: enabled && Boolean(interactionId),
    staleTime: 60000,
    refetchInterval: 300000,
  });
}

// Account verification hook
export function useAccountVerification(platformType: string = 'twitter', accountId: string, enabled: boolean = true) {
  return useQuery({
    queryKey: ['accountVerification', platformType, accountId],
    queryFn: () => nuanceAPI.verifyAccount(platformType, accountId),
    enabled: enabled && Boolean(accountId),
    staleTime: 300000, // 5 minutes - verification status doesn't change often
    refetchInterval: 600000, // 10 minutes
  });
}

// Topic relevance check hook (for content analysis)
export function useTopicCheck(content: string, topic: string, enabled: boolean = false) {
  return useQuery({
    queryKey: ['topicCheck', content, topic],
    queryFn: () => nuanceAPI.checkTopicRelevance(content, topic),
    enabled: enabled && Boolean(content && topic),
    staleTime: Infinity, // Content analysis results don't change
    retry: 1, // Limited due to rate limiting (2 req/min)
  });
}

// Enhanced miner profile hook (now with score breakdown)
export function useEnhancedMinerProfile(hotkey: string, enabled: boolean = true) {
  return useQuery({
    queryKey: ['enhancedMinerProfile', hotkey],
    queryFn: async (): Promise<MinerProfile> => {
      const [stats, accounts, posts, interactions, scoreBreakdown] = await Promise.all([
        nuanceAPI.getMinerStats(hotkey),
        nuanceAPI.getMinerAccounts(hotkey),
        nuanceAPI.getMinerPosts(hotkey, 1, 10),
        nuanceAPI.getMinerInteractions(hotkey, 1),
        nuanceAPI.getMinerScoreBreakdown(hotkey).catch(() => null), // Optional - may fail
      ]);

      return {
        stats,
        socialAccounts: accounts,
        recentPosts: posts,
        recentInteractions: interactions,
        scoreBreakdown,
      };
    },
    enabled: enabled && Boolean(hotkey),
    staleTime: 60000,
    refetchInterval: 300000,
  });
}