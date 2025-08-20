# Nuance Network API Documentation Analysis

## API Overview
- **Title**: Nuance Network API  
- **Version**: 0.1.0
- **Description**: API for the Nuance Network decentralized social media validation system
- **Base URL**: https://api.nuance.info

## Complete API Endpoints

### 1. **Miners Endpoints**

#### `/miners/{node_hotkey}/stats` (GET)
- **Purpose**: Get overall stats for a specific miner by hotkey
- **Returns**: Account count, post count, interaction count
- **Current Implementation**: ✅ Implemented

#### `/miners/scores` (GET) 
- **Purpose**: Get scores for ALL miners (not implemented in our app)
- **Returns**: List of all miner scores with hotkeys
- **Current Implementation**: ❌ **MISSING**

#### `/miners/{node_hotkey}/accounts` (GET)
- **Purpose**: Get verified social accounts for a miner
- **Parameters**: `skip`, `limit` (pagination)
- **Current Implementation**: ✅ Implemented

#### `/miners/{node_hotkey}/posts` (GET)
- **Purpose**: Get posts by specific miner
- **Parameters**: `skip`, `limit` (pagination)
- **Current Implementation**: ✅ Implemented

#### `/miners/{node_hotkey}/interactions` (GET)
- **Purpose**: Get interactions on miner's content
- **Parameters**: `skip`, `limit` (pagination)
- **Current Implementation**: ✅ Implemented

#### `/miners/{node_hotkey}/score-breakdown` (GET)
- **Purpose**: Detailed score breakdown showing contribution per post/interaction
- **Returns**: Categories, normalized scores, raw scores
- **Current Implementation**: ❌ **MISSING**

### 2. **Posts Endpoints**

#### `/posts/{platform_type}/recent` (GET)
- **Purpose**: Get recent posts from specific platform
- **Parameters**: `cutoff_date`, `skip`, `limit`, `min_interactions`, `only_scored`, `include_stats`
- **Current Implementation**: ❌ **MISSING**

#### `/posts/{platform_type}/{post_id}` (GET)
- **Purpose**: Get verification status for specific post
- **Parameters**: `include_stats`
- **Current Implementation**: ❌ **MISSING**

#### `/posts/{platform_type}/{post_id}/interactions` (GET)
- **Purpose**: Get interactions for specific post
- **Parameters**: `skip`, `limit`
- **Current Implementation**: ❌ **MISSING**

### 3. **Interactions Endpoints**

#### `/interactions/{platform_type}/recent` (GET)
- **Purpose**: Get recent interactions from platform
- **Parameters**: `cutoff_date`, `skip`, `limit`
- **Current Implementation**: ❌ **MISSING**

#### `/interactions/{platform_type}/{interaction_id}` (GET)
- **Purpose**: Get details for specific interaction
- **Current Implementation**: ❌ **MISSING**

### 4. **Accounts Endpoints**

#### `/accounts/verify/{platform_type}/{account_id}` (GET)
- **Purpose**: Check if account is verified in system
- **Current Implementation**: ❌ **MISSING**

### 5. **Content Validation Endpoints**

#### `/nuance/check` (POST)
- **Purpose**: Check text against nuance criteria (rate-limited: 2 req/min)
- **Body**: `{"content": "string"}`
- **Returns**: Boolean
- **Current Implementation**: ✅ Implemented

#### `/topic/check` (POST)
- **Purpose**: Check text against topic criteria (rate-limited: 2 req/min)
- **Body**: `{"content": "string", "topic": "string"}`
- **Returns**: Object with topic analysis
- **Current Implementation**: ❌ **MISSING**

### 6. **Stats Endpoints** (Currently Implemented)

#### `/stats/top-posts` (GET)
- **Purpose**: Get top posts
- **Parameters**: `start_date`, `end_date`, `limit` (max 200)
- **Current Implementation**: ✅ Implemented

#### `/stats/top-miners` (GET)
- **Purpose**: Get top miners
- **Parameters**: `start_date`, `end_date`, `limit` (max 200)
- **Current Implementation**: ✅ Implemented

#### `/stats/subnet-stats` (GET)
- **Purpose**: Get subnet statistics
- **Parameters**: `start_date`, `end_date`
- **Current Implementation**: ✅ Implemented

## Key Data Structures

### MinerStatsResponse
```typescript
{
  node_hotkey: string;
  account_count: number;
  post_count: number;
  interaction_count: number;
}
```

### TopMinerItem (Enhanced Structure)
```typescript
{
  uid: number;
  handle: string;
  score: number;
  retweet_count: number;
  reply_count: number;
  node_hotkey: string;
}
```

### PostVerificationResponse
```typescript
{
  platform_type: "twitter";
  post_id: string;
  account_id: string;
  content: string;
  topics: string[];
  processing_status: string;
  processing_note?: string;
  interaction_count: number;
  created_at: string;
  username?: string;
  profile_pic_url?: string;
  stats?: TwitterEngagementStats;
}
```

### TwitterEngagementStats
```typescript
{
  view_count?: number;
  reply_count?: number;
  retweet_count?: number;
  like_count?: number;
  quote_count?: number;
  bookmark_count?: number;
}
```

### MinerScoreBreakdownResponse
```typescript
{
  node_hotkey: string;
  final_score: number;
  total_items: number;
  categories: {
    [category: string]: {
      normalized_score: number;
      items: Array<{
        type: string;
        id: string;
        platform: string;
        raw_score: number;
        normalized_contribution: number;
      }>;
    };
  };
}
```

## Platform Support
- **Current Support**: Twitter only (`PlatformType: "twitter"`)
- **Processing Status**: `"new"`, `"accepted"`, `"rejected"`, `"error"`

## Rate Limiting
- **Content validation endpoints**: 2 requests per minute
- **Other endpoints**: No documented rate limits

## Date Formatting
- **Dates**: ISO format (YYYY-MM-DD or YYYY-MM-DDTHH:MM:SSZ)
- **Default periods**: 7 days for most stats endpoints