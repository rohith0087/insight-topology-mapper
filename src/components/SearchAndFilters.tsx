
import React from 'react';
import { Search } from 'lucide-react';

interface SearchAndFiltersProps {
  filterSettings: any;
  setFilterSettings: (settings: any) => void;
}

const SearchAndFilters: React.FC<SearchAndFiltersProps> = ({
  filterSettings,
  setFilterSettings
}) => {
  const handleFilterChange = (key: string) => {
    setFilterSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="p-6">
      <h3 className="text-lg font-semibold text-cyan-400 mb-4">Search & Filters</h3>
      
      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Search topology..."
          className="w-full bg-slate-900 border border-slate-600 rounded-lg pl-10 pr-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400"
        />
      </div>

      {/* Node Type Filters */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-slate-300">Node Types</h4>
        
        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={filterSettings.showDevices}
            onChange={() => handleFilterChange('showDevices')}
            className="w-4 h-4 text-cyan-600 bg-slate-900 border-slate-600 rounded focus:ring-cyan-500"
          />
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-cyan-400 rounded"></div>
            <span className="text-sm text-slate-300">Devices</span>
          </div>
        </label>

        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={filterSettings.showServices}
            onChange={() => handleFilterChange('showServices')}
            className="w-4 h-4 text-green-600 bg-slate-900 border-slate-600 rounded focus:ring-green-500"
          />
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-400 rounded"></div>
            <span className="text-sm text-slate-300">Services</span>
          </div>
        </label>

        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={filterSettings.showApplications}
            onChange={() => handleFilterChange('showApplications')}
            className="w-4 h-4 text-purple-600 bg-slate-900 border-slate-600 rounded focus:ring-purple-500"
          />
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-purple-400 rounded"></div>
            <span className="text-sm text-slate-300">Applications</span>
          </div>
        </label>

        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={filterSettings.showCloudResources}
            onChange={() => handleFilterChange('showCloudResources')}
            className="w-4 h-4 text-amber-600 bg-slate-900 border-slate-600 rounded focus:ring-amber-500"
          />
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-amber-400 rounded"></div>
            <span className="text-sm text-slate-300">Cloud Resources</span>
          </div>
        </label>

        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={filterSettings.showConnections}
            onChange={() => handleFilterChange('showConnections')}
            className="w-4 h-4 text-slate-600 bg-slate-900 border-slate-600 rounded focus:ring-slate-500"
          />
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-slate-400 rounded"></div>
            <span className="text-sm text-slate-300">Connections</span>
          </div>
        </label>
      </div>
    </div>
  );
};

export default SearchAndFilters;
