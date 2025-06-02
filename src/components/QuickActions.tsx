
import React from 'react';
import { Button } from './ui/button';
import { useNetworkData } from '@/hooks/useNetworkData';
import { toast } from 'sonner';

interface QuickActionsProps {
  onShowCritical?: () => void;
  onNetworkOverview?: () => void;
  onRecentChanges?: () => void;
  setStatusFilter?: (filter: string) => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({
  onShowCritical,
  onNetworkOverview,
  onRecentChanges,
  setStatusFilter
}) => {
  const { data: networkData } = useNetworkData();
  const nodes = networkData?.nodes || [];

  const handleShowCritical = () => {
    console.log('Show All Critical clicked');
    const criticalNodes = nodes.filter(node => node.data.status === 'critical');
    
    if (criticalNodes.length === 0) {
      toast.info('No critical nodes found in the network');
    } else {
      toast.success(`Found ${criticalNodes.length} critical node(s)`);
      if (setStatusFilter) {
        setStatusFilter('critical');
      }
    }
    
    if (onShowCritical) {
      onShowCritical();
    }
  };

  const handleNetworkOverview = () => {
    console.log('Network Overview clicked');
    const totalNodes = nodes.length;
    const healthyNodes = nodes.filter(node => node.data.status === 'healthy').length;
    const warningNodes = nodes.filter(node => node.data.status === 'warning').length;
    const criticalNodes = nodes.filter(node => node.data.status === 'critical').length;
    
    toast.info(`Network: ${totalNodes} nodes (${healthyNodes} healthy, ${warningNodes} warning, ${criticalNodes} critical)`);
    
    if (onNetworkOverview) {
      onNetworkOverview();
    }
  };

  const handleRecentChanges = () => {
    console.log('Recent Changes clicked');
    const recentNodes = nodes.filter(node => {
      const lastSeen = new Date(node.data.metadata?.last_seen || Date.now());
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      return lastSeen > oneHourAgo;
    });
    
    toast.info(`${recentNodes.length} nodes with recent activity in the last hour`);
    
    if (onRecentChanges) {
      onRecentChanges();
    }
  };

  return (
    <div className="pt-4 border-t border-slate-700">
      <h4 className="font-medium text-slate-200 mb-3">Quick Actions</h4>
      <div className="space-y-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleShowCritical}
          className="w-full justify-start border-slate-600 hover:bg-slate-700 bg-slate-900 text-slate-300 hover:text-white"
        >
          <span className="mr-2">🔍</span>
          Show All Critical
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleNetworkOverview}
          className="w-full justify-start border-slate-600 hover:bg-slate-700 bg-slate-900 text-slate-300 hover:text-white"
        >
          <span className="mr-2">📊</span>
          Network Overview
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRecentChanges}
          className="w-full justify-start border-slate-600 hover:bg-slate-700 bg-slate-900 text-slate-300 hover:text-white"
        >
          <span className="mr-2">⚡</span>
          Recent Changes
        </Button>
      </div>
    </div>
  );
};

export default QuickActions;
