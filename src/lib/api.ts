import type { 
  MinerStats, 
  SocialAccount, 
  Post, 
  Interaction, 
  SubnetStats,
  MinerScoresResponse,
  MinerScoreBreakdownResponse,
  PostVerificationResponse,
  InteractionResponse,
  AccountVerificationResponse,
  TopicCheckRequest,
  TopicCheckResponse
} from '../types/nuance';

export class NuanceAPI {
  private baseURL = '/api/nuance';
  
  constructor() {}

  private async fetchWithTimeout(url: string, options: RequestInit = {}, timeout: number = 10000) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    try {
      console.log(`Fetching via proxy: ${url}`);
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });
      clearTimeout(timeoutId);
      console.log(`Response status: ${response.status} for ${url}`);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      console.error(`Fetch error for ${url}:`, error);
      throw new Error(`Network error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getTopMiners(timeframe?: '7d' | '30d' | 'all', limit: number = 50): Promise<MinerStats[]> {
    const params = new URLSearchParams();
    params.append('endpoint', '/stats/top-miners');
    if (timeframe) params.append('timeframe', timeframe);
    params.append('limit', limit.toString());
    
    const response = await this.fetchWithTimeout(`${this.baseURL}?${params}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch top miners: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    const miners = data.miners || [];
    
    // Transform and add computed properties
    return miners.map((miner: any, index: number) => ({
      ...miner,
      rank: index + 1,
      username: miner.handle,
      hotkey: miner.node_hotkey,
      total_posts: (miner.retweet_count || 0) + (miner.reply_count || 0),
      total_interactions: miner.retweet_count + miner.reply_count,
      avg_score: miner.score,
      last_active: new Date().toISOString(), // Placeholder since not provided
    }));
  }

  async getAllMiners(timeframe?: '7d' | '30d' | 'all'): Promise<MinerStats[]> {
    const params = new URLSearchParams();
    params.append('endpoint', '/stats/top-miners');
    if (timeframe) params.append('timeframe', timeframe);
    // Try to get a high number to ensure we get all available miners
    params.append('limit', '500');
    
    const response = await this.fetchWithTimeout(`${this.baseURL}?${params}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch all miners: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    const miners = data.miners || [];
    
    console.log(`Fetched ${miners.length} total miners for search`);
    
    // Transform and add computed properties
    return miners.map((miner: any, index: number) => ({
      ...miner,
      rank: index + 1,
      username: miner.handle,
      hotkey: miner.node_hotkey,
      total_posts: (miner.retweet_count || 0) + (miner.reply_count || 0),
      total_interactions: miner.retweet_count + miner.reply_count,
      avg_score: miner.score,
      last_active: new Date().toISOString(), // Placeholder since not provided
    }));
  }

  async getMinerStats(hotkey: string): Promise<MinerStats> {
    const params = new URLSearchParams();
    params.append('endpoint', `/miners/${hotkey}/stats`);
    
    const response = await this.fetchWithTimeout(`${this.baseURL}?${params}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch miner stats: ${response.statusText}`);
    }
    return response.json();
  }

  async getMinerAccounts(hotkey: string): Promise<SocialAccount[]> {
    const params = new URLSearchParams();
    params.append('endpoint', `/miners/${hotkey}/accounts`);
    
    const response = await this.fetchWithTimeout(`${this.baseURL}?${params}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch miner accounts: ${response.statusText}`);
    }
    return response.json();
  }

  async getMinerPosts(hotkey: string, page: number = 1, limit: number = 20): Promise<Post[]> {
    const params = new URLSearchParams();
    params.append('endpoint', `/miners/${hotkey}/posts`);
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    
    const response = await this.fetchWithTimeout(`${this.baseURL}?${params}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch miner posts: ${response.statusText}`);
    }
    return response.json();
  }

  async getMinerInteractions(hotkey: string, page: number = 1): Promise<Interaction[]> {
    const params = new URLSearchParams();
    params.append('endpoint', `/miners/${hotkey}/interactions`);
    params.append('page', page.toString());
    
    const response = await this.fetchWithTimeout(`${this.baseURL}?${params}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch miner interactions: ${response.statusText}`);
    }
    return response.json();
  }

  async getTopPosts(filter?: 'recent' | 'top' | 'trending', limit: number = 50): Promise<Post[]> {
    const params = new URLSearchParams();
    params.append('endpoint', '/stats/top-posts');
    if (filter) params.append('filter', filter);
    params.append('limit', limit.toString());
    
    const response = await this.fetchWithTimeout(`${this.baseURL}?${params}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch top posts: ${response.statusText}`);
    }
    
    const data = await response.json();
    const posts = data.posts || [];
    
    // Transform and add computed properties
    return posts.map((post: any, index: number) => ({
      ...post,
      content: post.text,
      created_at: post.date,
      post_id: `${post.handle}-${post.date}-${index}`,
      platform_type: 'X',
      topics: [], // Not provided by API
      processing_status: 'ACCEPTED' as const,
      score: post.stats.like_count + post.stats.retweet_count,
      interactions_count: post.stats.reply_count + post.stats.retweet_count + post.stats.like_count,
    }));
  }

  async getSubnetStats(): Promise<SubnetStats> {
    const params = new URLSearchParams();
    params.append('endpoint', '/stats/subnet-stats');
    
    const response = await this.fetchWithTimeout(`${this.baseURL}?${params}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch subnet stats: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Transform to match expected format and add computed values
    return {
      ...data,
      total_miners: data.account_count,
      active_miners: data.account_count,
      total_posts: data.post_count,
      total_interactions: data.interaction_count,
      avg_quality_score: data.engagement_stats.like_count / Math.max(data.post_count, 1),
      network_activity: {
        posts_24h: data.post_count, // Placeholder - API doesn't provide 24h data
        interactions_24h: data.interaction_count, // Placeholder - API doesn't provide 24h data
      },
    };
  }

  async checkContentNuance(content: string): Promise<boolean> {
    const params = new URLSearchParams();
    params.append('endpoint', '/nuance/check');
    
    const response = await this.fetchWithTimeout(`${this.baseURL}?${params}`, {
      method: 'POST',
      body: JSON.stringify({ content })
    });
    if (!response.ok) {
      throw new Error(`Failed to check content nuance: ${response.statusText}`);
    }
    return response.json();
  }

  // MISSING ENDPOINTS - NOW IMPLEMENTING

  // 1. Get all miner scores
  async getAllMinerScores(): Promise<MinerScoresResponse> {
    const params = new URLSearchParams();
    params.append('endpoint', '/miners/scores');
    
    const response = await this.fetchWithTimeout(`${this.baseURL}?${params}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch miner scores: ${response.statusText}`);
    }
    return response.json();
  }

  // 2. Get miner score breakdown
  async getMinerScoreBreakdown(hotkey: string): Promise<MinerScoreBreakdownResponse> {
    const params = new URLSearchParams();
    params.append('endpoint', `/miners/${hotkey}/score-breakdown`);
    
    const response = await this.fetchWithTimeout(`${this.baseURL}?${params}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch miner score breakdown: ${response.statusText}`);
    }
    return response.json();
  }

  // 3. Get recent posts from platform
  async getRecentPosts(
    platformType: string = 'twitter', 
    params?: {
      cutoff_date?: string;
      skip?: number;
      limit?: number;
      min_interactions?: number;
      only_scored?: boolean;
      include_stats?: boolean;
    }
  ): Promise<PostVerificationResponse[]> {
    const queryParams = new URLSearchParams();
    queryParams.append('endpoint', `/posts/${platformType}/recent`);
    
    if (params?.cutoff_date) queryParams.append('cutoff_date', params.cutoff_date);
    if (params?.skip !== undefined) queryParams.append('skip', params.skip.toString());
    if (params?.limit !== undefined) queryParams.append('limit', params.limit.toString());
    if (params?.min_interactions !== undefined) queryParams.append('min_interactions', params.min_interactions.toString());
    if (params?.only_scored !== undefined) queryParams.append('only_scored', params.only_scored.toString());
    if (params?.include_stats !== undefined) queryParams.append('include_stats', params.include_stats.toString());
    
    const response = await this.fetchWithTimeout(`${this.baseURL}?${queryParams}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch recent posts: ${response.statusText}`);
    }
    return response.json();
  }

  // 4. Get specific post
  async getPost(platformType: string = 'twitter', postId: string, includeStats: boolean = false): Promise<PostVerificationResponse> {
    const params = new URLSearchParams();
    params.append('endpoint', `/posts/${platformType}/${postId}`);
    if (includeStats) params.append('include_stats', 'true');
    
    const response = await this.fetchWithTimeout(`${this.baseURL}?${params}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch post: ${response.statusText}`);
    }
    return response.json();
  }

  // 5. Get post interactions
  async getPostInteractions(
    platformType: string = 'twitter', 
    postId: string, 
    skip: number = 0, 
    limit: number = 20
  ): Promise<InteractionResponse[]> {
    const params = new URLSearchParams();
    params.append('endpoint', `/posts/${platformType}/${postId}/interactions`);
    params.append('skip', skip.toString());
    params.append('limit', limit.toString());
    
    const response = await this.fetchWithTimeout(`${this.baseURL}?${params}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch post interactions: ${response.statusText}`);
    }
    return response.json();
  }

  // 6. Get recent interactions
  async getRecentInteractions(
    platformType: string = 'twitter',
    params?: {
      cutoff_date?: string;
      skip?: number;
      limit?: number;
    }
  ): Promise<InteractionResponse[]> {
    const queryParams = new URLSearchParams();
    queryParams.append('endpoint', `/interactions/${platformType}/recent`);
    
    if (params?.cutoff_date) queryParams.append('cutoff_date', params.cutoff_date);
    if (params?.skip !== undefined) queryParams.append('skip', params.skip.toString());
    if (params?.limit !== undefined) queryParams.append('limit', params.limit.toString());
    
    const response = await this.fetchWithTimeout(`${this.baseURL}?${queryParams}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch recent interactions: ${response.statusText}`);
    }
    return response.json();
  }

  // 7. Get specific interaction
  async getInteraction(platformType: string = 'twitter', interactionId: string): Promise<InteractionResponse> {
    const params = new URLSearchParams();
    params.append('endpoint', `/interactions/${platformType}/${interactionId}`);
    
    const response = await this.fetchWithTimeout(`${this.baseURL}?${params}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch interaction: ${response.statusText}`);
    }
    return response.json();
  }

  // 8. Verify account
  async verifyAccount(platformType: string = 'twitter', accountId: string): Promise<AccountVerificationResponse> {
    const params = new URLSearchParams();
    params.append('endpoint', `/accounts/verify/${platformType}/${accountId}`);
    
    const response = await this.fetchWithTimeout(`${this.baseURL}?${params}`);
    if (!response.ok) {
      throw new Error(`Failed to verify account: ${response.statusText}`);
    }
    return response.json();
  }

  // 9. Check topic relevance
  async checkTopicRelevance(content: string, topic: string): Promise<TopicCheckResponse> {
    const params = new URLSearchParams();
    params.append('endpoint', '/topic/check');
    
    const response = await this.fetchWithTimeout(`${this.baseURL}?${params}`, {
      method: 'POST',
      body: JSON.stringify({ content, topic })
    });
    if (!response.ok) {
      throw new Error(`Failed to check topic relevance: ${response.statusText}`);
    }
    return response.json();
  }
}

export const nuanceAPI = new NuanceAPI();