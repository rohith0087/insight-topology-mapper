
import React from 'react';
import { Badge } from './ui/badge';
import { useNetworkData } from '@/hooks/useNetworkData';

interface StatusFiltersProps {
  statusFilter: string;
  setStatusFilter: (filter: string) => void;
}

const StatusFilters: React.FC<StatusFiltersProps> = ({
  statusFilter,
  setStatusFilter
}) => {
  const { data: networkData } = useNetworkData();
  const nodes = networkData?.nodes || [];

  // Calculate actual counts from the network data
  const allCount = nodes.length;
  const healthyCount = nodes.filter(node => node.data.status === 'healthy').length;
  const warningCount = nodes.filter(node => node.data.status === 'warning').length;
  const criticalCount = nodes.filter(node => node.data.status === 'critical').length;

  const statusOptions = [
    { value: 'all', label: 'All Status', count: allCount },
    { value: 'healthy', label: 'Healthy', count: healthyCount },
    { value: 'warning', label: 'Warning', count: warningCount },
    { value: 'critical', label: 'Critical', count: criticalCount }
  ];

  const handleStatusClick = (status: string) => {
    console.log('Status filter clicked:', status);
    setStatusFilter(status);
  };

  return (
    <div className="space-y-3">
      <h4 className="font-medium text-slate-200">Status Filter</h4>
      <div className="space-y-2">
        {statusOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => handleStatusClick(option.value)}
            className={`w-full flex items-center justify-between p-2 rounded-lg border transition-colors ${
              statusFilter === option.value
                ? 'border-cyan-500 bg-cyan-500/10 text-cyan-400'
                : 'border-slate-600 bg-slate-900 text-slate-300 hover:bg-slate-800 hover:border-slate-500'
            }`}
          >
            <span className="text-sm">{option.label}</span>
            <Badge
              variant={statusFilter === option.value ? "default" : "secondary"}
              className={`text-xs ${
                statusFilter === option.value 
                  ? 'bg-cyan-600 text-white' 
                  : 'bg-slate-700 text-slate-300 border-slate-600'
              }`}
            >
              {option.count}
            </Badge>
          </button>
        ))}
      </div>
    </div>
  );
};

export default StatusFilters;
