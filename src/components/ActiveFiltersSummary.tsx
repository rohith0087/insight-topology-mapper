
import React from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Server, Cog, Smartphone, Cloud, Cable } from 'lucide-react';

interface ActiveFiltersSummaryProps {
  filterSettings: {
    showDevices: boolean;
    showServices: boolean;
    showApplications: boolean;
    showCloudResources: boolean;
    showConnections: boolean;
  };
  statusFilter: string;
  searchTerm: string;
  activeFiltersCount: number;
  onClearAll: () => void;
}

const ActiveFiltersSummary: React.FC<ActiveFiltersSummaryProps> = ({
  filterSettings,
  statusFilter,
  searchTerm,
  activeFiltersCount,
  onClearAll
}) => {
  const filterOptions = [
    { 
      key: 'showDevices', 
      label: 'Network Devices', 
      icon: <Server className="w-4 h-4 text-cyan-400" />
    },
    { 
      key: 'showServices', 
      label: 'Services', 
      icon: <Cog className="w-4 h-4 text-green-400" />
    },
    { 
      key: 'showApplications', 
      label: 'Applications', 
      icon: <Smartphone className="w-4 h-4 text-purple-400" />
    },
    { 
      key: 'showCloudResources', 
      label: 'Cloud Resources', 
      icon: <Cloud className="w-4 h-4 text-blue-400" />
    },
    { 
      key: 'showConnections', 
      label: 'Connections', 
      icon: <Cable className="w-4 h-4 text-slate-400" />
    }
  ];

  if (activeFiltersCount === 0) return null;

  return (
    <div className="bg-slate-900 rounded-lg p-3 border border-slate-600">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-slate-300">
          Active Filters ({activeFiltersCount})
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearAll}
          className="text-xs text-slate-400 hover:text-white h-6 px-2 bg-transparent hover:bg-slate-700"
        >
          Clear All
        </Button>
      </div>
      <div className="flex flex-wrap gap-1">
        {Object.entries(filterSettings).map(([key, enabled]) => {
          if (!enabled) return null;
          const option = filterOptions.find(opt => opt.key === key);
          return (
            <Badge key={key} variant="secondary" className="text-xs bg-slate-700 text-slate-200 border-slate-600 flex items-center gap-1">
              {option?.icon} {option?.label}
            </Badge>
          );
        })}
        {statusFilter !== 'all' && (
          <Badge variant="secondary" className="text-xs bg-slate-700 text-slate-200 border-slate-600">
            Status: {statusFilter}
          </Badge>
        )}
        {searchTerm && (
          <Badge variant="secondary" className="text-xs bg-slate-700 text-slate-200 border-slate-600">
            Search: {searchTerm}
          </Badge>
        )}
      </div>
    </div>
  );
};

export default ActiveFiltersSummary;
