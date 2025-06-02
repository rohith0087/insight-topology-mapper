
import React from 'react';
import { Filter, Server, Cog, Smartphone, Cloud, Cable } from 'lucide-react';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Badge } from './ui/badge';

interface NodeTypeFiltersProps {
  filterSettings: {
    showDevices: boolean;
    showServices: boolean;
    showApplications: boolean;
    showCloudResources: boolean;
    showConnections: boolean;
  };
  setFilterSettings: (settings: any) => void;
}

const NodeTypeFilters: React.FC<NodeTypeFiltersProps> = ({
  filterSettings,
  setFilterSettings
}) => {
  const filterOptions = [
    { 
      key: 'showDevices', 
      label: 'Network Devices', 
      icon: <Server className="w-4 h-4 text-cyan-400" />, 
      count: 24 
    },
    { 
      key: 'showServices', 
      label: 'Services', 
      icon: <Cog className="w-4 h-4 text-green-400" />, 
      count: 18 
    },
    { 
      key: 'showApplications', 
      label: 'Applications', 
      icon: <Smartphone className="w-4 h-4 text-purple-400" />, 
      count: 12 
    },
    { 
      key: 'showCloudResources', 
      label: 'Cloud Resources', 
      icon: <Cloud className="w-4 h-4 text-blue-400" />, 
      count: 8 
    },
    { 
      key: 'showConnections', 
      label: 'Connections', 
      icon: <Cable className="w-4 h-4 text-slate-400" />, 
      count: 156 
    }
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-2">
        <Filter className="w-4 h-4 text-cyan-400" />
        <h4 className="font-medium text-slate-200">Node Types</h4>
      </div>
      
      <div className="space-y-3">
        {filterOptions.map((option) => (
          <div key={option.key} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Switch
                id={option.key}
                checked={filterSettings[option.key]}
                onCheckedChange={(checked) =>
                  setFilterSettings({ ...filterSettings, [option.key]: checked })
                }
              />
              <Label htmlFor={option.key} className="text-sm text-slate-300 cursor-pointer flex items-center gap-2">
                {option.icon}
                {option.label}
              </Label>
            </div>
            <Badge variant="outline" className="text-xs border-slate-600 bg-slate-900 text-slate-300">
              {option.count}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NodeTypeFilters;
