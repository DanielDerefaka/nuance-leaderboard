import { Post } from '../types/nuance';

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACCEPTED': return 'text-green-400';
      case 'REJECTED': return 'text-red-400';
      case 'PROCESSING': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const truncateContent = (content: string, maxLength: number = 150) => {
    if (!content) return '';
    return content.length > maxLength ? content.slice(0, maxLength) + '...' : content;
  };

  return (
    <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4 hover:border-gray-700 transition-colors">
      <div className="mb-3">
        <p className="text-gray-300 text-sm leading-relaxed">
          "{truncateContent(post.content || post.text)}"
        </p>
      </div>

      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2 text-xs text-gray-500">
          <span>@{post.handle || post.platform_type}</span>
          <span>•</span>
          <span>{formatDate(post.created_at || post.date)}</span>
        </div>
        
        {post.score && (
          <div className="text-right">
            <span className="text-sm font-bold text-white">Score: {post.score}</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center space-x-2">
          {post.topics && post.topics.length > 0 && (
            <div className="flex items-center space-x-1">
              {post.topics.slice(0, 2).map((topic, index) => (
                <span 
                  key={index}
                  className="px-2 py-1 bg-gray-800 text-gray-300 rounded text-xs"
                >
                  {topic}
                </span>
              ))}
              {post.topics.length > 2 && (
                <span className="text-gray-500">+{post.topics.length - 2}</span>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center space-x-3">
          {(post.interactions_count || (post.stats && (post.stats.reply_count + post.stats.retweet_count + post.stats.like_count))) && (
            <span className="text-gray-400">
              💬 {post.interactions_count || (post.stats.reply_count + post.stats.retweet_count + post.stats.like_count)} interactions
            </span>
          )}
          {post.processing_status && (
            <span className={getStatusColor(post.processing_status)}>
              {post.processing_status.toLowerCase()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}