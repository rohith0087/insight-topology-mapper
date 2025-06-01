
import React, { useState } from 'react';
import { Search, Filter, X, CheckCircle, AlertTriangle, XCircle, Clock } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface SearchAndFiltersProps {
  filterSettings: any;
  setFilterSettings: (settings: any) => void;
}

const SearchAndFilters: React.FC<SearchAndFiltersProps> = ({
  filterSettings,
  setFilterSettings
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const nodeTypes = [
    { key: 'showDevices', label: 'Devices', color: 'bg-cyan-400', count: 12 },
    { key: 'showServices', label: 'Services', color: 'bg-green-400', count: 8 },
    { key: 'showApplications', label: 'Applications', color: 'bg-purple-400', count: 15 },
    { key: 'showCloudResources', label: 'Cloud Resources', color: 'bg-amber-400', count: 6 },
    { key: 'showConnections', label: 'Connections', color: 'bg-slate-400', count: 45 }
  ];

  const statusFilters = [
    { key: 'healthy', label: 'Healthy', icon: CheckCircle, color: 'text-green-400', count: 25 },
    { key: 'warning', label: 'Warning', icon: AlertTriangle, color: 'text-yellow-400', count: 8 },
    { key: 'critical', label: 'Critical', icon: XCircle, color: 'text-red-400', count: 3 },
    { key: 'unknown', label: 'Unknown', icon: Clock, color: 'text-slate-400', count: 5 }
  ];

  const handleFilterChange = (key: string) => {
    setFilterSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleStatusFilter = (status: string) => {
    const isActive = activeFilters.includes(status);
    if (isActive) {
      setActiveFilters(prev => prev.filter(f => f !== status));
    } else {
      setActiveFilters(prev => [...prev, status]);
    }
  };

  const clearAllFilters = () => {
    setFilterSettings({
      showDevices: true,
      showServices: true,
      showApplications: true,
      showCloudResources: true,
      showConnections: true
    });
    setActiveFilters([]);
    setSearchQuery('');
  };

  const hasActiveFilters = !nodeTypes.every(type => filterSettings[type.key]) || 
    activeFilters.length > 0 || searchQuery.length > 0;

  return (
    <div className="space-y-6">
      {/* Search */}
      <Card className="bg-slate-800 border-slate-600">
        <CardHeader className="pb-3">
          <CardTitle className="text-cyan-400 text-lg flex items-center">
            <Search className="w-5 h-5 mr-2" />
            Search Topology
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search nodes, IPs, hostnames..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border-slate-600 pl-10 pr-4 text-white placeholder-slate-400 focus:border-cyan-400"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
          {searchQuery && (
            <div className="mt-3">
              <Badge variant="outline" className="border-cyan-500 text-cyan-400">
                Searching: "{searchQuery}"
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Node Type Filters */}
      <Card className="bg-slate-800 border-slate-600">
        <CardHeader className="pb-3">
          <CardTitle className="text-cyan-400 text-lg flex items-center">
            <Filter className="w-5 h-5 mr-2" />
            Node Types
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {nodeTypes.map((type) => (
            <label key={type.key} className="flex items-center justify-between cursor-pointer p-2 rounded hover:bg-slate-700 transition-colors">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={filterSettings[type.key]}
                  onChange={() => handleFilterChange(type.key)}
                  className="w-4 h-4 text-cyan-600 bg-slate-900 border-slate-600 rounded focus:ring-cyan-500"
                />
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 ${type.color} rounded`}></div>
                  <span className="text-slate-300 font-medium">{type.label}</span>
                </div>
              </div>
              <Badge variant="secondary" className="bg-slate-700 text-slate-300">
                {type.count}
              </Badge>
            </label>
          ))}
        </CardContent>
      </Card>

      {/* Status Filters */}
      <Card className="bg-slate-800 border-slate-600">
        <CardHeader className="pb-3">
          <CardTitle className="text-cyan-400 text-lg">Status Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {statusFilters.map((status) => {
            const Icon = status.icon;
            const isActive = activeFilters.includes(status.key);
            return (
              <Button
                key={status.key}
                variant={isActive ? "default" : "ghost"}
                size="sm"
                onClick={() => handleStatusFilter(status.key)}
                className={`w-full justify-between ${
                  isActive 
                    ? 'bg-cyan-600 hover:bg-cyan-700' 
                    : 'hover:bg-slate-700 text-slate-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : status.color}`} />
                  <span>{status.label}</span>
                </div>
                <Badge variant="secondary" className="bg-slate-700 text-slate-300">
                  {status.count}
                </Badge>
              </Button>
            );
          })}
        </CardContent>
      </Card>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <Card className="bg-slate-900 border-slate-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-slate-300">Active Filters</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="text-slate-400 hover:text-white"
              >
                Clear All
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {searchQuery && (
                <Badge variant="outline" className="border-cyan-500 text-cyan-400">
                  Search: {searchQuery}
                </Badge>
              )}
              {activeFilters.map(filter => (
                <Badge key={filter} variant="outline" className="border-yellow-500 text-yellow-400">
                  {filter}
                </Badge>
              ))}
              {nodeTypes.filter(type => !filterSettings[type.key]).map(type => (
                <Badge key={type.key} variant="outline" className="border-red-500 text-red-400">
                  Hide {type.label}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SearchAndFilters;
