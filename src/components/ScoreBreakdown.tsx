import { MinerScoreBreakdownResponse } from '../types/nuance';

interface ScoreBreakdownProps {
  breakdown: MinerScoreBreakdownResponse;
}

export function ScoreBreakdown({ breakdown }: ScoreBreakdownProps) {
  return (
    <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Score Breakdown</h3>
        <div className="text-right">
          <p className="text-2xl font-bold text-white">{breakdown.final_score.toFixed(2)}</p>
          <p className="text-xs text-gray-400">Final Score</p>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-400">
          Based on {breakdown.total_items} scored items
        </p>
      </div>

      <div className="space-y-4">
        {Object.entries(breakdown.categories).map(([category, data]) => (
          <div key={category} className="border border-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-white capitalize">{category}</h4>
              <span className="text-sm font-bold text-white">
                {data.normalized_score.toFixed(2)}
              </span>
            </div>
            
            <div className="space-y-2">
              {data.items.slice(0, 3).map((item, index) => (
                <div key={index} className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="capitalize text-gray-400">{item.type}</span>
                    <span className="text-gray-500">•</span>
                    <span className="text-gray-400">{item.platform}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-500">Raw: {item.raw_score.toFixed(1)}</span>
                    <span className="text-gray-300">
                      Contrib: {item.normalized_contribution.toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
              
              {data.items.length > 3 && (
                <p className="text-xs text-gray-500 text-center pt-1">
                  +{data.items.length - 3} more items
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}