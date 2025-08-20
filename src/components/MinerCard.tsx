import { MinerStats } from '../types/nuance';

interface MinerCardProps {
  miner: MinerStats;
  onViewProfile?: (hotkey: string) => void;
}

export function MinerCard({ miner, onViewProfile }: MinerCardProps) {
  const formatHotkey = (hotkey: string) => {
    if (!hotkey) return 'Unknown';
    return `${hotkey.slice(0, 6)}...${hotkey.slice(-4)}`;
  };

  const getActivityStatus = (lastActive?: string) => {
    if (!lastActive) return { text: 'Active recently', color: 'text-green-400' };
    
    const lastActiveDate = new Date(lastActive);
    const now = new Date();
    const hoursAgo = Math.floor((now.getTime() - lastActiveDate.getTime()) / (1000 * 60 * 60));
    
    if (hoursAgo < 1) return { text: 'Active now', color: 'text-green-400' };
    if (hoursAgo < 24) return { text: `Active ${hoursAgo}h ago`, color: 'text-green-400' };
    if (hoursAgo < 168) return { text: `Active ${Math.floor(hoursAgo / 24)}d ago`, color: 'text-yellow-400' };
    return { text: 'Inactive', color: 'text-red-400' };
  };

  const activity = getActivityStatus(miner.last_active);

  return (
    <div 
      className="bg-gray-900/50 border border-gray-800 rounded-lg p-4 hover:border-gray-700 transition-all cursor-pointer group"
      onClick={() => onViewProfile?.(miner.hotkey || miner.node_hotkey)}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-8 h-8 bg-gray-800 rounded-full text-sm font-bold">
            #{miner.rank}
          </div>
          <div>
            <p className="font-medium text-white group-hover:text-gray-200">
              {miner.username || miner.handle || 'Anonymous Miner'}
            </p>
            <div className="flex items-center space-x-1">
              <p className="text-xs text-gray-500 font-mono">
                {formatHotkey(miner.hotkey || miner.node_hotkey)}
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigator.clipboard.writeText(miner.hotkey || miner.node_hotkey);
                }}
                className="text-gray-500 hover:text-white transition-colors p-0.5 rounded hover:bg-gray-800"
                title="Copy hotkey"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        <div className="text-right">
          <p className="text-xl font-bold text-white">{miner.score.toFixed(1)}</p>
          <p className="text-xs text-gray-400">Score</p>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center space-x-4">
          <span className="text-gray-400">
            {miner.total_posts} posts
          </span>
          <span className="text-gray-400">
            {miner.total_interactions} interactions
          </span>
        </div>
        
        <div className="flex items-center space-x-1">
          <div className={`w-2 h-2 rounded-full ${activity.color.replace('text-', 'bg-')}`}></div>
          <span className={`text-xs ${activity.color}`}>
            {activity.text}
          </span>
        </div>
      </div>
    </div>
  );
}