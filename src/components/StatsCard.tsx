interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'stable';
}

export function StatsCard({ title, value, subtitle, icon, trend }: StatsCardProps) {
  const getTrendColor = () => {
    switch (trend) {
      case 'up': return 'text-green-400';
      case 'down': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'up': return '↗';
      case 'down': return '↘';
      default: return '→';
    }
  };

  return (
    <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6 hover:border-gray-700 transition-colors">
      <div className="flex items-center justify-between mb-2">
        {icon && (
          <div className="p-2 bg-gray-800 rounded-lg">
            {icon}
          </div>
        )}
        {trend && (
          <span className={`text-sm ${getTrendColor()}`}>
            {getTrendIcon()}
          </span>
        )}
      </div>
      
      <div className="space-y-1">
        <h3 className="text-2xl font-bold text-white">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </h3>
        <p className="text-sm font-medium text-gray-300">{title}</p>
        {subtitle && (
          <p className="text-xs text-gray-500">{subtitle}</p>
        )}
      </div>
    </div>
  );
}