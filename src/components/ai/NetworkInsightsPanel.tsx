
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Lightbulb, 
  AlertTriangle, 
  Info, 
  AlertCircle,
  TrendingUp,
  Shield,
  Network,
  Clock
} from 'lucide-react';
import { NetworkInsight } from '@/types/dataReconciliation';

interface NetworkInsightsPanelProps {
  insights: NetworkInsight[];
  onInsightClick?: (insight: NetworkInsight) => void;
}

const NetworkInsightsPanel: React.FC<NetworkInsightsPanelProps> = ({
  insights,
  onInsightClick
}) => {
  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'critical':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'recommendation':
        return <Lightbulb className="w-5 h-5 text-blue-500" />;
      default:
        return <Info className="w-5 h-5 text-cyan-500" />;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'critical':
        return 'border-red-500 bg-red-50 dark:bg-red-950';
      case 'warning':
        return 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950';
      case 'recommendation':
        return 'border-blue-500 bg-blue-50 dark:bg-blue-950';
      default:
        return 'border-cyan-500 bg-cyan-50 dark:bg-cyan-950';
    }
  };

  const getBadgeVariant = (type: string) => {
    switch (type) {
      case 'critical':
        return 'destructive';
      case 'warning':
        return 'secondary';
      default:
        return 'default';
    }
  };

  if (!insights || insights.length === 0) {
    return (
      <Card className="bg-slate-800 border-slate-600">
        <CardHeader>
          <CardTitle className="text-slate-300 flex items-center space-x-2">
            <Lightbulb className="w-5 h-5" />
            <span>Network Insights</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-slate-400">
            <Network className="w-12 h-12 mx-auto mb-3" />
            <p>No insights available</p>
            <p className="text-sm">Run an AI analysis to generate insights</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-800 border-slate-600">
      <CardHeader>
        <CardTitle className="text-slate-300 flex items-center space-x-2">
          <Lightbulb className="w-5 h-5" />
          <span>Network Insights</span>
          <Badge variant="outline" className="ml-2">
            {insights.length} insights
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 max-h-96 overflow-y-auto">
        {insights.map((insight) => (
          <Card 
            key={insight.id} 
            className={`${getInsightColor(insight.type)} border-l-4 cursor-pointer hover:shadow-md transition-shadow`}
            onClick={() => onInsightClick?.(insight)}
          >
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  {getInsightIcon(insight.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <h4 className="font-medium text-slate-100">{insight.title}</h4>
                    <Badge variant={getBadgeVariant(insight.type)} className="ml-2">
                      {insight.type}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-slate-300 mt-1 line-clamp-2">
                    {insight.description}
                  </p>
                  
                  {insight.suggested_actions && insight.suggested_actions.length > 0 && (
                    <div className="mt-3">
                      <p className="text-xs text-slate-400 mb-1">Suggested Actions:</p>
                      <ul className="text-xs text-slate-300 space-y-1">
                        {insight.suggested_actions.slice(0, 2).map((action, index) => (
                          <li key={index} className="flex items-center space-x-1">
                            <span className="w-1 h-1 bg-slate-400 rounded-full"></span>
                            <span>{action}</span>
                          </li>
                        ))}
                        {insight.suggested_actions.length > 2 && (
                          <li className="text-slate-500">
                            +{insight.suggested_actions.length - 2} more
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center space-x-2 text-xs text-slate-400">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(insight.created_at).toLocaleDateString()}</span>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <span className="text-xs text-slate-400">Confidence:</span>
                      <Badge variant="outline" className="text-xs">
                        {Math.round(insight.confidence * 100)}%
                      </Badge>
                    </div>
                  </div>
                  
                  {insight.affected_nodes && insight.affected_nodes.length > 0 && (
                    <div className="mt-2">
                      <span className="text-xs text-slate-400">
                        Affects {insight.affected_nodes.length} node(s)
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
};

export default NetworkInsightsPanel;
