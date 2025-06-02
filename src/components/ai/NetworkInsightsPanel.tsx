
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
  Clock,
  X
} from 'lucide-react';
import { NetworkInsight } from '@/types/dataReconciliation';

interface NetworkInsightsPanelProps {
  insights: NetworkInsight[];
  onInsightClick?: (insight: NetworkInsight) => void;
  onClose?: () => void;
}

const NetworkInsightsPanel: React.FC<NetworkInsightsPanelProps> = ({
  insights,
  onInsightClick,
  onClose
}) => {
  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'critical':
        return <AlertCircle className="w-5 h-5 text-red-400" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
      case 'recommendation':
        return <Lightbulb className="w-5 h-5 text-blue-400" />;
      default:
        return <Info className="w-5 h-5 text-cyan-400" />;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'critical':
        return 'border-l-4 border-l-red-500 bg-red-900/20 hover:bg-red-900/30';
      case 'warning':
        return 'border-l-4 border-l-yellow-500 bg-yellow-900/20 hover:bg-yellow-900/30';
      case 'recommendation':
        return 'border-l-4 border-l-blue-500 bg-blue-900/20 hover:bg-blue-900/30';
      default:
        return 'border-l-4 border-l-cyan-500 bg-cyan-900/20 hover:bg-cyan-900/30';
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
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-slate-600">
          <div className="flex items-center space-x-2">
            <Lightbulb className="w-5 h-5 text-cyan-400" />
            <h3 className="text-lg font-semibold text-cyan-400">Network Insights</h3>
          </div>
          {onClose && (
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="text-slate-400 hover:text-white hover:bg-slate-700"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
        
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center py-8 text-slate-400">
            <Network className="w-12 h-12 mx-auto mb-3" />
            <p className="text-slate-300 font-medium">No insights available</p>
            <p className="text-sm text-slate-400">Run an AI analysis to generate insights</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-slate-800">
      <div className="flex items-center justify-between p-4 border-b border-slate-600">
        <div className="flex items-center space-x-2">
          <Lightbulb className="w-5 h-5 text-cyan-400" />
          <h3 className="text-lg font-semibold text-cyan-400">Network Insights</h3>
          <Badge variant="outline" className="border-cyan-500 text-cyan-300 bg-cyan-900/30">
            {insights.length} insights
          </Badge>
        </div>
        {onClose && (
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="text-slate-400 hover:text-white hover:bg-slate-700"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {insights.map((insight) => (
          <div 
            key={insight.id} 
            className={`${getInsightColor(insight.type)} rounded-lg p-4 cursor-pointer transition-all duration-200 bg-slate-700/50 hover:bg-slate-700/70`}
            onClick={() => onInsightClick?.(insight)}
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 mt-0.5">
                {getInsightIcon(insight.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-white text-sm leading-tight">{insight.title}</h4>
                  <Badge 
                    variant={getBadgeVariant(insight.type)} 
                    className="ml-2 text-xs flex-shrink-0"
                  >
                    {insight.type}
                  </Badge>
                </div>
                
                <p className="text-sm text-slate-200 mb-3 leading-relaxed">
                  {insight.description}
                </p>
                
                {insight.suggested_actions && insight.suggested_actions.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs font-medium text-slate-300 mb-2">Suggested Actions:</p>
                    <ul className="text-xs text-slate-200 space-y-1">
                      {insight.suggested_actions.slice(0, 2).map((action, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <span className="w-1 h-1 bg-cyan-400 rounded-full mt-2 flex-shrink-0"></span>
                          <span className="leading-relaxed">{action}</span>
                        </li>
                      ))}
                      {insight.suggested_actions.length > 2 && (
                        <li className="text-slate-400 text-xs ml-3">
                          +{insight.suggested_actions.length - 2} more actions
                        </li>
                      )}
                    </ul>
                  </div>
                )}
                
                <div className="flex items-center justify-between pt-2 border-t border-slate-600">
                  <div className="flex items-center space-x-2 text-xs text-slate-400">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(insight.created_at).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-slate-400">Confidence:</span>
                    <Badge variant="outline" className="text-xs border-slate-500 text-slate-300 bg-slate-600/50">
                      {Math.round(insight.confidence * 100)}%
                    </Badge>
                  </div>
                </div>
                
                {insight.affected_nodes && insight.affected_nodes.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-slate-600">
                    <span className="text-xs text-slate-400">
                      Affects {insight.affected_nodes.length} node(s)
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NetworkInsightsPanel;
