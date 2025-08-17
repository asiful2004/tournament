import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Calendar, Users, DollarSign } from "lucide-react";

interface AnalyticsData {
  date: string;
  visitors: number;
  registrations: number;
  revenue: number;
}

interface AdminAnalyticsChartProps {
  data: AnalyticsData[];
  period: 'daily' | 'weekly' | 'monthly';
  className?: string;
}

export function AdminAnalyticsChart({ data, period, className = "" }: AdminAnalyticsChartProps) {
  const maxVisitors = Math.max(...data.map(d => d.visitors));
  const maxRevenue = Math.max(...data.map(d => d.revenue));
  const totalRevenue = data.reduce((sum, d) => sum + d.revenue, 0);
  const totalVisitors = data.reduce((sum, d) => sum + d.visitors, 0);
  const totalRegistrations = data.reduce((sum, d) => sum + d.registrations, 0);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    switch (period) {
      case 'daily':
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      case 'weekly':
        return `Week of ${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
      case 'monthly':
        return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      default:
        return dateStr;
    }
  };

  return (
    <Card className={`bg-game-blue border-game-purple/20 glow-effect ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            Analytics Overview - {period.charAt(0).toUpperCase() + period.slice(1)}
          </CardTitle>
          <Calendar className="h-5 w-5 text-game-purple" />
        </div>
      </CardHeader>
      <CardContent>
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center p-3 bg-game-darker/50 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <Users className="h-4 w-4 text-blue-400 mr-1" />
              <span className="text-sm text-gray-300">Visitors</span>
            </div>
            <div className="text-lg font-bold text-white">{totalVisitors.toLocaleString()}</div>
          </div>
          <div className="text-center p-3 bg-game-darker/50 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <Users className="h-4 w-4 text-green-400 mr-1" />
              <span className="text-sm text-gray-300">Signups</span>
            </div>
            <div className="text-lg font-bold text-white">{totalRegistrations.toLocaleString()}</div>
          </div>
          <div className="text-center p-3 bg-game-darker/50 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <DollarSign className="h-4 w-4 text-yellow-400 mr-1" />
              <span className="text-sm text-gray-300">Revenue</span>
            </div>
            <div className="text-lg font-bold text-white">৳{(totalRevenue / 100).toLocaleString()}</div>
          </div>
        </div>

        {/* Simple Bar Chart */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-300 mb-3">Visitor Trends</h4>
          {data.slice(-7).map((item, index) => {
            const visitorPercentage = maxVisitors > 0 ? (item.visitors / maxVisitors) * 100 : 0;
            const revenuePercentage = maxRevenue > 0 ? (item.revenue / maxRevenue) * 100 : 0;
            
            return (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-xs text-gray-400">
                  <span>{formatDate(item.date)}</span>
                  <span>{item.visitors} visitors • ৳{(item.revenue / 100).toFixed(0)}</span>
                </div>
                
                {/* Visitor Bar */}
                <div className="h-2 bg-game-darker rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-400 transition-all duration-500"
                    style={{ width: `${Math.max(visitorPercentage, 2)}%` }}
                  />
                </div>
                
                {/* Revenue Bar */}
                <div className="h-1 bg-game-darker rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-yellow-500 to-yellow-400 transition-all duration-500"
                    style={{ width: `${Math.max(revenuePercentage, 1)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {data.length === 0 && (
          <div className="text-center py-8">
            <TrendingUp className="h-12 w-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No analytics data available</p>
            <p className="text-xs text-gray-500 mt-1">Data will appear as users interact with the platform</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default AdminAnalyticsChart;