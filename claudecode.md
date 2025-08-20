# Nuance Network Tracking Platform - Claude Development Prompt

## Project Overview
Create a modern, minimalist tracking platform for the Nuance Network (Bittensor subnet 23) that allows users to monitor quality content scores, view leaderboards, and track performance analytics.

## Design Requirements

### Color Scheme & Aesthetics
- **Primary Colors**: Pure black (#000000) and white (#ffffff)
- **Secondary Colors**: Various shades of gray (#111111, #1a1a1a, #2a2a2a, #666666, #a0a0a0)
- **Style**: Soft, modern, minimalist design
- **Theme**: Dark-compatible by default
- **No rainbow colors or bright accents** - keep it monochromatic and professional

### Visual Design Principles
- Clean typography with good hierarchy
- Subtle borders and shadows
- Smooth hover effects and transitions
- Card-based layout with rounded corners
- Generous white space
- Modern sans-serif fonts (Inter, SF Pro, or system fonts)

## Core Features to Implement

### 1. Header Navigation
- Logo/brand name: "Nuance Tracker"
- Navigation links: Dashboard, Leaderboard, Analytics, Search
- Clean, sticky header with backdrop blur effect

### 2. Dashboard Overview
- Hero section with platform description
- Key statistics grid showing:
  - Total active miners
  - Total validated posts
  - Average quality score
  - Network activity (24h posts/interactions)

### 3. Miner Search & Tracking
- Search input for hotkey or username lookup
- "Track My Score" functionality
- Individual miner profile pages showing:
  - Current score and rank
  - Recent posts and their scores
  - Interaction history
  - Performance trends (simple charts)

### 4. Leaderboard Section
- Top miners ranked by score
- Filter options: All time, 30 days, 7 days
- Miner cards showing:
  - Rank number
  - Username/handle (if available)
  - Hotkey (truncated)
  - Current score
  - Recent activity indicator

### 5. Content Discovery
- Featured high-quality posts
- Filter by: Top rated, Recent, Trending
- Post cards showing:
  - Content preview
  - Author information
  - Quality score
  - Engagement metrics
  - Time posted

### 6. Analytics Section (Optional)
- Network health metrics
- Score distribution charts
- Activity trends over time
- Topic analysis (if available)

## Technical Implementation

### API Integration
Use the Nuance Network API endpoints:
```javascript
const API_BASE = 'https://api.nuance.info';

// Key endpoints to implement:
// GET /stats/top-miners
// GET /miners/{hotkey}/stats  
// GET /miners/{hotkey}/posts
// GET /miners/{hotkey}/interactions
// GET /stats/subnet-stats
// POST /nuance/check (for content validation)
```

### Data Management
- Implement client-side caching for frequently accessed data
- Real-time updates every 30-60 seconds for live data
- Loading states and error handling
- Pagination for large datasets

### Responsive Design
- Mobile-first approach
- Responsive grid layouts
- Touch-friendly interface elements
- Optimized for both desktop and mobile viewing

## Specific UI Components to Create

### 1. Miner Card Component
```
┌─────────────────────────────────────┐
│ #1  @username                 94.2  │
│     5F7nTtN8WHq...                  │
│     ○ Active 2h ago                 │
└─────────────────────────────────────┘
```

### 2. Post Card Component
```
┌─────────────────────────────────────┐
│ "Technology has become integral..." │
│ @author • 2h ago           Score: 92│
│ 🔗 View on X    💬 12 interactions  │
└─────────────────────────────────────┘
```

### 3. Stats Card Component
```
┌─────────────────┐
│      2,847      │
│ Validated Posts │
└─────────────────┘
```

### 4. Search Component
```
┌─────────────────────────────────────┐
│ 🔍 Search by hotkey or username...  │
└─────────────────────────────────────┘
```

## User Experience Flow

1. **Landing**: User sees hero section with network overview
2. **Explore**: Browse leaderboard to see top performers  
3. **Search**: Enter their hotkey to track personal score
4. **Track**: View detailed profile with score history
5. **Discover**: Browse high-quality content from top miners

## Additional Features

### Loading States
- Skeleton components while data loads
- Smooth transitions between states
- Error boundaries with retry options

### Interactions
- Hover effects on cards and buttons
- Smooth scrolling and animations
- Click-to-copy for hotkeys
- External links to X/Twitter posts

### Data Refresh
- Auto-refresh indicators
- Manual refresh button
- Last updated timestamps
- Real-time score updates

## Code Structure Preferences

### HTML/CSS/JavaScript Structure
- Semantic HTML5 elements
- CSS Grid and Flexbox for layouts  
- Vanilla JavaScript or minimal framework
- CSS custom properties for theming
- Progressive enhancement approach

### Modern CSS Features
- CSS Grid for complex layouts
- Custom properties for consistent theming
- Backdrop filters for glass morphism effects
- CSS animations for smooth interactions
- Media queries for responsive design

## Implementation Instructions

1. **Start with the basic HTML structure** and navigation
2. **Implement the CSS design system** with custom properties
3. **Add the API integration layer** for data fetching
4. **Build each section incrementally**: stats → leaderboard → search → content
5. **Add interactivity and animations** last
6. **Test on mobile devices** and optimize

## Sample Data Structure
```javascript
// Miner data structure
{
  hotkey: "5F7nTtN8WHqjqK9XhVVi...",
  username: "@thoughtful_alex", 
  score: 94.2,
  rank: 1,
  total_posts: 156,
  total_interactions: 1243,
  last_active: "2024-01-15T10:30:00Z",
  recent_posts: [...],
  score_trend: "up" // up, down, stable
}
```

Create a fully functional, production-ready application that's clean, fast, and focused on the core user needs of tracking Nuance Network performance and discovering quality content.



// Nuance Network API Integration
// Base API configuration

class NuanceAPI {
  private baseURL = 'https://api.nuance.info';
  
  constructor() {}

  // Get top miners with optional filters
  async getTopMiners(timeframe?: '7d' | '30d' | 'all', limit: number = 50) {
    const params = new URLSearchParams();
    if (timeframe) params.append('timeframe', timeframe);
    params.append('limit', limit.toString());
    
    const response = await fetch(`${this.baseURL}/stats/top-miners?${params}`);
    return response.json();
  }

  // Get miner details and statistics
  async getMinerStats(hotkey: string) {
    const response = await fetch(`${this.baseURL}/miners/${hotkey}/stats`);
    return response.json();
  }

  // Get miner's social accounts
  async getMinerAccounts(hotkey: string) {
    const response = await fetch(`${this.baseURL}/miners/${hotkey}/accounts`);
    return response.json();
  }

  // Get miner's posts with pagination
  async getMinerPosts(hotkey: string, page: number = 1, limit: number = 20) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    });
    
    const response = await fetch(`${this.baseURL}/miners/${hotkey}/posts?${params}`);
    return response.json();
  }

  // Get miner's interactions
  async getMinerInteractions(hotkey: string, page: number = 1) {
    const params = new URLSearchParams({
      page: page.toString()
    });
    
    const response = await fetch(`${this.baseURL}/miners/${hotkey}/interactions?${params}`);
    return response.json();
  }

  // Get detailed score breakdown for a miner
  async getMinerScoreBreakdown(hotkey: string) {
    const response = await fetch(`${this.baseURL}/miners/${hotkey}/score-breakdown`);
    return response.json();
  }

  // Get top posts across the network
  async getTopPosts(filter?: 'recent' | 'top' | 'trending', limit: number = 50) {
    const params = new URLSearchParams();
    if (filter) params.append('filter', filter);
    params.append('limit', limit.toString());
    
    const response = await fetch(`${this.baseURL}/stats/top-posts?${params}`);
    return response.json();
  }

  // Get overall subnet statistics  
  async getSubnetStats() {
    const response = await fetch(`${this.baseURL}/stats/subnet-stats`);
    return response.json();
  }

  // Check if content would be considered "nuanced"
  async checkContentNuance(content: string) {
    const response = await fetch(`${this.baseURL}/nuance/check`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content })
    });
    return response.json();
  }

  // Check content topic relevance
  async checkContentTopic(content: string) {
    const response = await fetch(`${this.baseURL}/topic/check`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content })
    });
    return response.json();
  }
}

// Usage examples for different platform types

// 1. Dashboard Component
class DashboardService {
  private api = new NuanceAPI();

  async getDashboardData() {
    const [subnetStats, topMiners, topPosts] = await Promise.all([
      this.api.getSubnetStats(),
      this.api.getTopMiners('30d', 10),
      this.api.getTopPosts('top', 10)
    ]);

    return {
      stats: subnetStats,
      leaderboard: topMiners,
      featuredContent: topPosts
    };
  }
}

// 2. Miner Profile Service
class MinerProfileService {
  private api = new NuanceAPI();

  async getMinerProfile(hotkey: string) {
    const [stats, accounts, posts, interactions, scoreBreakdown] = await Promise.all([
      this.api.getMinerStats(hotkey),
      this.api.getMinerAccounts(hotkey),
      this.api.getMinerPosts(hotkey, 1, 10),
      this.api.getMinerInteractions(hotkey, 1),
      this.api.getMinerScoreBreakdown(hotkey)
    ]);

    return {
      stats,
      socialAccounts: accounts,
      recentPosts: posts,
      recentInteractions: interactions,
      scoreBreakdown
    };
  }
}

// 3. Content Validation Service
class ContentValidationService {
  private api = new NuanceAPI();

  async validateContent(content: string) {
    const [nuanceCheck, topicCheck] = await Promise.all([
      this.api.checkContentNuance(content),
      this.api.checkContentTopic(content)
    ]);

    return {
      isNuanced: nuanceCheck.approved,
      nuanceScore: nuanceCheck.confidence,
      topics: topicCheck.topics,
      suggestions: this.generateSuggestions(nuanceCheck, topicCheck)
    };
  }

  private generateSuggestions(nuanceCheck: any, topicCheck: any) {
    const suggestions = [];
    
    if (!nuanceCheck.approved) {
      suggestions.push({
        type: 'nuance',
        message: 'Try adding more balanced perspectives or acknowledging complexity in the issue'
      });
    }

    if (topicCheck.topics.length === 0) {
      suggestions.push({
        type: 'topic',
        message: 'Consider focusing on trending topics like AI, cryptocurrency, or current events'
      });
    }

    return suggestions;
  }
}

// 4. Real-time Updates Service
class RealtimeUpdatesService {
  private api = new NuanceAPI();
  private updateInterval: NodeJS.Timeout | null = null;

  startUpdates(callback: (data: any) => void, intervalMs: number = 30000) {
    this.updateInterval = setInterval(async () => {
      try {
        const [subnetStats, topMiners] = await Promise.all([
          this.api.getSubnetStats(),
          this.api.getTopMiners('7d', 5)
        ]);

        callback({
          timestamp: new Date(),
          stats: subnetStats,
          topMiners: topMiners
        });
      } catch (error) {
        console.error('Failed to fetch updates:', error);
      }
    }, intervalMs);
  }

  stopUpdates() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }
}

// 5. Search and Discovery Service
class DiscoveryService {
  private api = new NuanceAPI();

  async searchMiners(query: string, filters?: {
    minScore?: number;
    timeframe?: '7d' | '30d' | 'all';
    category?: string;
  }) {
    // Note: This endpoint might not exist yet, but could be added
    const params = new URLSearchParams();
    params.append('q', query);
    if (filters?.minScore) params.append('min_score', filters.minScore.toString());
    if (filters?.timeframe) params.append('timeframe', filters.timeframe);
    if (filters?.category) params.append('category', filters.category);

    // Fallback: get all miners and filter client-side
    const allMiners = await this.api.getTopMiners(filters?.timeframe);
    return this.filterMinersClientSide(allMiners, query, filters);
  }

  private filterMinersClientSide(miners: any[], query: string, filters?: any) {
    return miners
      .filter(miner => {
        const matchesQuery = miner.username.toLowerCase().includes(query.toLowerCase()) ||
                           miner.hotkey.includes(query);
        const matchesScore = !filters?.minScore || miner.score >= filters.minScore;
        return matchesQuery && matchesScore;
      })
      .slice(0, 50); // Limit results
  }

  async getContentByCategory(category: string, limit: number = 20) {
    const posts = await this.api.getTopPosts('recent', limit * 2);
    
    // Filter by category (assuming posts have category/topic data)
    return posts.filter((post: any) => 
      post.topics && post.topics.includes(category)
    ).slice(0, limit);
  }
}

// Example usage in a React component
export const useNuanceData = (hotkey?: string) => {
  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const api = new NuanceAPI();
        
        if (hotkey) {
          // Fetch specific miner data
          const minerProfile = new MinerProfileService();
          const result = await minerProfile.getMinerProfile(hotkey);
          setData(result);
        } else {
          // Fetch dashboard data
          const dashboard = new DashboardService();
          const result = await dashboard.getDashboardData();
          setData(result);
        }
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [hotkey]);

  return { data, loading, error };
};

// Type definitions for better TypeScript support
export interface MinerStats {
  hotkey: string;
  score: number;
  rank: number;
  total_posts: number;
  total_interactions: number;
  avg_score: number;
  last_active: string;
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
  platform_type: string;
  post_id: string;
  content: string;
  topics: string[];
  created_at: string;
  processing_status: 'PENDING' | 'PROCESSING' | 'ACCEPTED' | 'REJECTED';
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
  total_miners: number;
  active_miners: number;
  total_posts: number;
  total_interactions: number;
  avg_quality_score: number;
  network_activity: {
    posts_24h: number;
    interactions_24h: number;
  };
}

// Advanced features for platform builders

// 6. Analytics Service
class AnalyticsService {
  private api = new NuanceAPI();

  async getMinerAnalytics(hotkey: string, timeframe: '7d' | '30d' | '90d' = '30d') {
    const [stats, posts, interactions] = await Promise.all([
      this.api.getMinerStats(hotkey),
      this.api.getMinerPosts(hotkey, 1, 100),
      this.api.getMinerInteractions(hotkey, 1)
    ]);

    return this.processAnalytics(stats, posts, interactions, timeframe);
  }

  private processAnalytics(stats: any, posts: any[], interactions: any[], timeframe: string) {
    const now = new Date();
    const timeframeDays = timeframe === '7d' ? 7 : timeframe === '30d' ? 30 : 90;
    const cutoffDate = new Date(now.getTime() - timeframeDays * 24 * 60 * 60 * 1000);

    const recentPosts = posts.filter(p => new Date(p.created_at) > cutoffDate);
    const recentInteractions = interactions.filter(i => new Date(i.created_at) > cutoffDate);

    // Calculate trends
    const scoresByDay = this.groupByDay(recentPosts, 'created_at');
    const interactionsByDay = this.groupByDay(recentInteractions, 'created_at');
    
    // Topic analysis
    const topicFrequency = this.analyzeTopics(recentPosts);
    
    // Engagement analysis
    const engagementRate = recentInteractions.length / Math.max(recentPosts.length, 1);

    return {
      overview: {
        total_posts: recentPosts.length,
        total_interactions: recentInteractions.length,
        avg_score: stats.avg_score,
        engagement_rate: engagementRate
      },
      trends: {
        scores_by_day: scoresByDay,
        interactions_by_day: interactionsByDay
      },
      topics: topicFrequency,
      performance_metrics: {
        consistency: this.calculateConsistency(scoresByDay),
        growth_rate: this.calculateGrowthRate(scoresByDay),
        peak_performance: Math.max(...Object.values(scoresByDay))
      }
    };
  }

  private groupByDay(items: any[], dateField: string) {
    return items.reduce((acc, item) => {
      const date = new Date(item[dateField]).toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});
  }

  private analyzeTopics(posts: any[]) {
    const topicCounts = {};
    posts.forEach(post => {
      if (post.topics) {
        post.topics.forEach(topic => {
          topicCounts[topic] = (topicCounts[topic] || 0) + 1;
        });
      }
    });
    
    return Object.entries(topicCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([topic, count]) => ({ topic, count }));
  }

  private calculateConsistency(scoresByDay: any) {
    const values = Object.values(scoresByDay);
    if (values.length < 2) return 0;
    
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / values.length;
    return Math.max(0, 100 - Math.sqrt(variance));
  }

  private calculateGrowthRate(scoresByDay: any) {
    const dates = Object.keys(scoresByDay).sort();
    if (dates.length < 2) return 0;
    
    const firstHalf = dates.slice(0, Math.floor(dates.length / 2));
    const secondHalf = dates.slice(Math.floor(dates.length / 2));
    
    const firstAvg = firstHalf.reduce((sum, date) => sum + scoresByDay[date], 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, date) => sum + scoresByDay[date], 0) / secondHalf.length;
    
    return ((secondAvg - firstAvg) / firstAvg) * 100;
  }
}

// 7. Notification Service
class NotificationService {
  private api = new NuanceAPI();
  private subscribers: Map<string, Function[]> = new Map();

  async subscribeToMiner(hotkey: string, callback: Function) {
    if (!this.subscribers.has(hotkey)) {
      this.subscribers.set(hotkey, []);
      this.startPolling(hotkey);
    }
    
    this.subscribers.get(hotkey)?.push(callback);
  }

  private async startPolling(hotkey: string) {
    let lastCheck = new Date();
    
    setInterval(async () => {
      try {
        const [posts, interactions] = await Promise.all([
          this.api.getMinerPosts(hotkey, 1, 10),
          this.api.getMinerInteractions(hotkey, 1)
        ]);

        // Check for new posts since last check
        const newPosts = posts.filter(p => new Date(p.created_at) > lastCheck);
        const newInteractions = interactions.filter(i => new Date(i.created_at) > lastCheck);

        if (newPosts.length > 0 || newInteractions.length > 0) {
          const callbacks = this.subscribers.get(hotkey) || [];
          callbacks.forEach(cb => cb({
            type: 'update',
            hotkey,
            newPosts,
            newInteractions,
            timestamp: new Date()
          }));
        }

        lastCheck = new Date();
      } catch (error) {
        console.error(`Error polling miner ${hotkey}:`, error);
      }
    }, 60000); // Check every minute
  }

  unsubscribeFromMiner(hotkey: string, callback: Function) {
    const callbacks = this.subscribers.get(hotkey);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }
}

// 8. Export Service for Data Analysis
class ExportService {
  private api = new NuanceAPI();

  async exportMinerData(hotkey: string, format: 'csv' | 'json' = 'json') {
    const [stats, posts, interactions, accounts] = await Promise.all([
      this.api.getMinerStats(hotkey),
      this.api.getMinerPosts(hotkey, 1, 1000), // Get all posts
      this.api.getMinerInteractions(hotkey, 1),
      this.api.getMinerAccounts(hotkey)
    ]);

    const data = {
      exported_at: new Date().toISOString(),
      miner: {
        hotkey,
        stats,
        accounts
      },
      posts,
      interactions
    };

    if (format === 'csv') {
      return this.convertToCSV(data);
    }

    return data;
  }

  private convertToCSV(data: any) {
    // Convert posts to CSV
    const postsCSV = this.objectArrayToCSV(data.posts);
    const interactionsCSV = this.objectArrayToCSV(data.interactions);
    
    return {
      posts_csv: postsCSV,
      interactions_csv: interactionsCSV,
      metadata: data.miner
    };
  }

  private objectArrayToCSV(objArray: any[]) {
    if (!objArray.length) return '';
    
    const headers = Object.keys(objArray[0]);
    const csvContent = [
      headers.join(','),
      ...objArray.map(obj => 
        headers.map(header => {
          const value = obj[header];
          // Handle nested objects/arrays
          const stringValue = typeof value === 'object' ? JSON.stringify(value) : value;
          // Escape commas and quotes
          return `"${String(stringValue).replace(/"/g, '""')}"`;
        }).join(',')
      )
    ].join('\n');
    
    return csvContent;
  }
}

// 9. Comparison Service
class ComparisonService {
  private api = new NuanceAPI();

  async compareMiners(hotkeys: string[]) {
    const minerData = await Promise.all(
      hotkeys.map(async hotkey => {
        const [stats, posts, interactions] = await Promise.all([
          this.api.getMinerStats(hotkey),
          this.api.getMinerPosts(hotkey, 1, 50),
          this.api.getMinerInteractions(hotkey, 1)
        ]);

        return {
          hotkey,
          stats,
          recent_posts: posts,
          recent_interactions: interactions
        };
      })
    );

    return this.generateComparison(minerData);
  }

  private generateComparison(minerData: any[]) {
    const metrics = ['score', 'total_posts', 'total_interactions', 'avg_score'];
    
    const comparison = {
      miners: minerData.map(m => ({
        hotkey: m.hotkey,
        stats: m.stats
      })),
      rankings: {},
      insights: []
    };

    // Rank miners by each metric
    metrics.forEach(metric => {
      const sorted = [...minerData].sort((a, b) => 
        (b.stats[metric] || 0) - (a.stats[metric] || 0)
      );
      
      comparison.rankings[metric] = sorted.map(m => m.hotkey);
    });

    // Generate insights
    const topPerformer = minerData.reduce((best, current) => 
      (current.stats.score || 0) > (best.stats.score || 0) ? current : best
    );

    const mostActive = minerData.reduce((most, current) => 
      (current.stats.total_posts || 0) > (most.stats.total_posts || 0) ? current : most
    );

    comparison.insights.push(
      `Best performer: ${topPerformer.hotkey} with score ${topPerformer.stats.score}`,
      `Most active: ${mostActive.hotkey} with ${mostActive.stats.total_posts} posts`
    );

    return comparison;
  }
}

export {
  NuanceAPI,
  DashboardService,
  MinerProfileService,
  ContentValidationService,
  RealtimeUpdatesService,
  DiscoveryService,
  AnalyticsService,
  NotificationService,
  ExportService,
  ComparisonService
};