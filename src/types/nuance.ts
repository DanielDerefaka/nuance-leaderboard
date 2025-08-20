export interface MinerStats {
  uid: number;
  handle: string;
  score: number;
  retweet_count: number;
  reply_count: number;
  node_hotkey: string;
  rank?: number; // We'll calculate this
  username?: string; // Alias for handle
  hotkey?: string; // Alias for node_hotkey
  total_posts?: number;
  total_interactions?: number;
  avg_score?: number;
  last_active?: string;
}

export interface SocialAccount {
  platform_type: string;
  account_id: string;
  account_username: string;
  verification_post_id: string;
  created_at: string;
  extra_data: {
    followers_count?: number;
    following_count?: number;
    verified?: boolean;
  };
}

export interface Post {
  date: string;
  handle: string;
  text: string;
  stats: {
    view_count: number;
    reply_count: number;
    retweet_count: number;
    like_count: number;
    quote_count: number;
    bookmark_count: number;
  };
  // Aliases for compatibility
  platform_type?: string;
  post_id?: string;
  content?: string;
  topics?: string[];
  created_at?: string;
  processing_status?: 'PENDING' | 'PROCESSING' | 'ACCEPTED' | 'REJECTED';
  score?: number;
  interactions_count?: number;
}

export interface Interaction {
  platform_type: string;
  interaction_id: string;
  interaction_type: 'REPLY' | 'QUOTE' | 'RETWEET';
  account_id: string;
  post_id: string;
  content: string;
  created_at: string;
  processing_status: 'PENDING' | 'PROCESSING' | 'ACCEPTED' | 'REJECTED';
}

export interface SubnetStats {
  account_count: number;
  post_count: number;
  interaction_count: number;
  engagement_stats: {
    view_count: number;
    reply_count: number;
    retweet_count: number;
    like_count: number;
    quote_count: number;
    bookmark_count: number;
  };
  // Computed values
  total_miners?: number;
  active_miners?: number;
  total_posts?: number;
  total_interactions?: number;
  avg_quality_score?: number;
  network_activity?: {
    posts_24h: number;
    interactions_24h: number;
  };
}

export interface DashboardData {
  stats: SubnetStats;
  leaderboard: MinerStats[];
  featuredContent: Post[];
}

export interface MinerProfile {
  stats: MinerStats;
  socialAccounts: SocialAccount[];
  recentPosts: Post[];
  recentInteractions: Interaction[];
  scoreBreakdown?: MinerScoreBreakdownResponse;
}

// New types for missing endpoints
export interface MinerScore {
  node_hotkey: string;
  score: number;
}

export interface MinerScoresResponse {
  miner_scores: MinerScore[];
}

export interface CategoryScoreItem {
  type: string;
  id: string;
  platform: string;
  raw_score: number;
  normalized_contribution: number;
}

export interface CategoryBreakdown {
  normalized_score: number;
  items: CategoryScoreItem[];
}

export interface MinerScoreBreakdownResponse {
  node_hotkey: string;
  final_score: number;
  total_items: number;
  categories: {
    [category: string]: CategoryBreakdown;
  };
}

export interface PostVerificationResponse {
  platform_type: 'twitter';
  post_id: string;
  account_id: string;
  content: string;
  topics: string[];
  processing_status: 'new' | 'accepted' | 'rejected' | 'error';
  processing_note?: string;
  interaction_count: number;
  created_at: string;
  username?: string;
  profile_pic_url?: string;
  stats?: TwitterEngagementStats;
}

export interface TwitterEngagementStats {
  view_count?: number;
  reply_count?: number;
  retweet_count?: number;
  like_count?: number;
  quote_count?: number;
  bookmark_count?: number;
}

export interface InteractionResponse {
  platform_type: 'twitter';
  interaction_id: string;
  interaction_type: string;
  post_id: string;
  account_id: string;
  content?: string;
  processing_status: 'new' | 'accepted' | 'rejected' | 'error';
  processing_note?: string;
  created_at: string;
  stats?: TwitterEngagementStats;
}

export interface AccountVerificationResponse {
  platform_type: 'twitter';
  account_id: string;
  username: string;
  node_hotkey?: string;
  node_netuid?: number;
  is_verified: boolean;
}

export interface TopicCheckRequest {
  content: string;
  topic: string;
}

export interface TopicCheckResponse {
  [key: string]: any;
}