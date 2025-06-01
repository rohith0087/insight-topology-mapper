
import React, { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Label } from './ui/label';

interface SearchAndFiltersProps {
  filterSettings: {
    showDevices: boolean;
    showServices: boolean;
    showApplications: boolean;
    showCloudResources: boolean;
    showConnections: boolean;
  };
  setFilterSettings: (settings: any) => void;
}

const SearchAndFilters: React.FC<SearchAndFiltersProps> = ({
  filterSettings,
  setFilterSettings
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filterOptions = [
    { key: 'showDevices', label: 'Network Devices', icon: '🖥️', count: 24 },
    { key: 'showServices', label: 'Services', icon: '⚙️', count: 18 },
    { key: 'showApplications', label: 'Applications', icon: '📱', count: 12 },
    { key: 'showCloudResources', label: 'Cloud Resources', icon: '☁️', count: 8 },
    { key: 'showConnections', label: 'Connections', icon: '🔗', count: 156 }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Status', count: 62 },
    { value: 'healthy', label: 'Healthy', count: 48 },
    { value: 'warning', label: 'Warning', count: 10 },
    { value: 'critical', label: 'Critical', count: 4 }
  ];

  const clearSearch = () => {
    setSearchTerm('');
    setStatusFilter('all');
  };

  const getActiveFiltersCount = () => {
    const activeTypeFilters = Object.values(filterSettings).filter(Boolean).length;
    const hasStatusFilter = statusFilter !== 'all';
    const hasSearch = searchTerm.length > 0;
    return activeTypeFilters + (hasStatusFilter ? 1 : 0) + (hasSearch ? 1 : 0);
  };

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <Input
            placeholder="Search nodes, IPs, services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-slate-900 border-slate-600 text-white placeholder-slate-400"
          />
          {searchTerm && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        
        {searchTerm && (
          <div className="text-sm text-slate-400">
            Searching for: <span className="text-cyan-400">"{searchTerm}"</span>
          </div>
        )}
      </div>

      {/* Active Filters Summary */}
      {getActiveFiltersCount() > 0 && (
        <div className="bg-slate-900 rounded-lg p-3 border border-slate-600">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-300">
              Active Filters ({getActiveFiltersCount()})
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setFilterSettings({
                  showDevices: true,
                  showServices: true,
                  showApplications: true,
                  showCloudResources: true,
                  showConnections: true
                });
                setStatusFilter('all');
                setSearchTerm('');
              }}
              className="text-xs text-slate-400 hover:text-white h-6 px-2"
            >
              Clear All
            </Button>
          </div>
          <div className="flex flex-wrap gap-1">
            {Object.entries(filterSettings).map(([key, enabled]) => {
              if (!enabled) return null;
              const option = filterOptions.find(opt => opt.key === key);
              return (
                <Badge key={key} variant="secondary" className="text-xs">
                  {option?.icon} {option?.label}
                </Badge>
              );
            })}
            {statusFilter !== 'all' && (
              <Badge variant="secondary" className="text-xs">
                Status: {statusFilter}
              </Badge>
            )}
            {searchTerm && (
              <Badge variant="secondary" className="text-xs">
                Search: {searchTerm}
              </Badge>
            )}
          </div>
        </div>
      )}

      {/* Node Type Filters */}
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
                <Label htmlFor={option.key} className="text-sm text-slate-300 cursor-pointer">
                  <span className="mr-2">{option.icon}</span>
                  {option.label}
                </Label>
              </div>
              <Badge variant="outline" className="text-xs border-slate-600">
                {option.count}
              </Badge>
            </div>
          ))}
        </div>
      </div>

      {/* Status Filter */}
      <div className="space-y-3">
        <h4 className="font-medium text-slate-200">Status Filter</h4>
        <div className="space-y-2">
          {statusOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setStatusFilter(option.value)}
              className={`w-full flex items-center justify-between p-2 rounded-lg border transition-colors ${
                statusFilter === option.value
                  ? 'border-cyan-500 bg-cyan-500/10 text-cyan-400'
                  : 'border-slate-600 bg-slate-900 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <span className="text-sm">{option.label}</span>
              <Badge
                variant={statusFilter === option.value ? "default" : "secondary"}
                className="text-xs"
              >
                {option.count}
              </Badge>
            </button>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="pt-4 border-t border-slate-700">
        <h4 className="font-medium text-slate-200 mb-3">Quick Actions</h4>
        <div className="space-y-2">
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start border-slate-600 hover:bg-slate-700"
          >
            <span className="mr-2">🔍</span>
            Show All Critical
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start border-slate-600 hover:bg-slate-700"
          >
            <span className="mr-2">📊</span>
            Network Overview
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start border-slate-600 hover:bg-slate-700"
          >
            <span className="mr-2">⚡</span>
            Recent Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SearchAndFilters;
