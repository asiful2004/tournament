import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface AdminStatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  subtitle?: string;
  className?: string;
}

export function AdminStatsCard({ 
  title, 
  value, 
  icon, 
  trend, 
  subtitle, 
  className = "" 
}: AdminStatsCardProps) {
  const getTrendIcon = () => {
    if (!trend) return null;
    
    if (trend.value === 0) {
      return <Minus className="h-4 w-4 text-gray-400" />;
    }
    
    return trend.isPositive ? (
      <TrendingUp className="h-4 w-4 text-green-400" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-400" />
    );
  };

  const getTrendColor = () => {
    if (!trend || trend.value === 0) return "text-gray-400";
    return trend.isPositive ? "text-green-400" : "text-red-400";
  };

  return (
    <Card className={`bg-game-blue border-game-purple/20 glow-effect hover:scale-105 transition-transform duration-200 ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-300">
          {title}
        </CardTitle>
        <div className="text-game-purple">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-white mb-1">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </div>
        {(trend || subtitle) && (
          <div className="flex items-center space-x-2 text-xs">
            {trend && (
              <div className={`flex items-center space-x-1 ${getTrendColor()}`}>
                {getTrendIcon()}
                <span>
                  {Math.abs(trend.value)}%
                </span>
              </div>
            )}
            {subtitle && (
              <span className="text-gray-400">
                {subtitle}
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default AdminStatsCard;