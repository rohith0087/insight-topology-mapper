
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BarChart3, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useDataQualityMetrics } from '@/hooks/useDataReconciliation';

const DataQualityMetrics: React.FC = () => {
  const { data: metrics, isLoading } = useDataQualityMetrics();

  const getMetricIcon = (type: string) => {
    const icons = {
      accuracy: '🎯',
      completeness: '📊',
      consistency: '🔄',
      timeliness: '⏰',
      validity: '✅'
    };
    return icons[type as keyof typeof icons] || '📈';
  };

  const getMetricColor = (value: number) => {
    if (value >= 80) return 'text-green-500';
    if (value >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getProgressColor = (value: number) => {
    if (value >= 80) return 'bg-green-500';
    if (value >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getTrendIcon = (current: number, previous?: number) => {
    if (!previous) return <Minus className="w-4 h-4 text-slate-400" />;
    if (current > previous) return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (current < previous) return <TrendingDown className="w-4 h-4 text-red-500" />;
    return <Minus className="w-4 h-4 text-slate-400" />;
  };

  const groupedMetrics = metrics?.reduce((acc, metric) => {
    const key = `${metric.data_source_id}-${metric.metric_type}`;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(metric);
    return acc;
  }, {} as Record<string, typeof metrics>);

  const latestMetrics = Object.values(groupedMetrics || {}).map(group => 
    group.sort((a, b) => new Date(b.calculated_at).getTime() - new Date(a.calculated_at).getTime())[0]
  );

  if (isLoading) {
    return <div className="text-white">Loading quality metrics...</div>;
  }

  return (
    <Card className="bg-slate-700 border-slate-600 h-full">
      <CardHeader>
        <CardTitle className="text-slate-300 flex items-center space-x-2">
          <BarChart3 className="w-5 h-5" />
          <span>Data Quality Metrics</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="h-full overflow-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {latestMetrics.map((metric) => (
            <Card key={`${metric.data_source_id}-${metric.metric_type}`} className="bg-slate-600 border-slate-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{getMetricIcon(metric.metric_type)}</span>
                    <div>
                      <p className="font-medium text-white capitalize">{metric.metric_type}</p>
                      <p className="text-xs text-slate-400">
                        {metric.data_sources?.name || 'Unknown Source'}
                      </p>
                    </div>
                  </div>
                  {getTrendIcon(metric.metric_value)}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className={`text-2xl font-bold ${getMetricColor(metric.metric_value)}`}>
                      {Math.round(metric.metric_value)}%
                    </span>
                    <Badge className="bg-slate-500 text-slate-300 text-xs">
                      {metric.data_sources?.type || 'Unknown'}
                    </Badge>
                  </div>

                  <Progress 
                    value={metric.metric_value} 
                    className="h-2"
                  />

                  <div className="flex justify-between text-xs text-slate-400">
                    <span>Last updated:</span>
                    <span>{new Date(metric.calculated_at).toLocaleDateString()}</span>
                  </div>

                  {metric.metadata && Object.keys(metric.metadata).length > 0 && (
                    <div className="mt-2 p-2 bg-slate-700 rounded text-xs">
                      <p className="text-slate-400 mb-1">Details:</p>
                      {Object.entries(metric.metadata).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="text-slate-400">{key}:</span>
                          <span className="text-slate-300">{String(value)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {latestMetrics.length === 0 && (
          <div className="text-center py-8 text-slate-400">
            <BarChart3 className="w-12 h-12 mx-auto mb-3" />
            <p>No quality metrics available</p>
            <p className="text-sm">Metrics will appear here after data sources are synced</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DataQualityMetrics;
