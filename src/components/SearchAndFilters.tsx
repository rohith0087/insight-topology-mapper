
import React, { useState } from 'react';
import SearchInput from './SearchInput';
import ActiveFiltersSummary from './ActiveFiltersSummary';
import NodeTypeFilters from './NodeTypeFilters';
import StatusFilters from './StatusFilters';
import QuickActions from './QuickActions';
import NaturalLanguageSearch from './search/NaturalLanguageSearch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Search, Sparkles } from 'lucide-react';

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

  const handleClearAll = () => {
    setFilterSettings({
      showDevices: true,
      showServices: true,
      showApplications: true,
      showCloudResources: true,
      showConnections: true
    });
    setStatusFilter('all');
    setSearchTerm('');
  };

  const handleNLFiltersChange = (nlFilters: any) => {
    // Apply natural language filters
    setFilterSettings({
      showDevices: nlFilters.showDevices,
      showServices: nlFilters.showServices,
      showApplications: nlFilters.showApplications,
      showCloudResources: nlFilters.showCloudResources,
      showConnections: nlFilters.showConnections
    });
    setStatusFilter(nlFilters.statusFilter || 'all');
    setSearchTerm(nlFilters.searchTerm || '');
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="natural" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-slate-800 border-slate-600">
          <TabsTrigger value="natural" className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4" />
            <span>AI Search</span>
          </TabsTrigger>
          <TabsTrigger value="manual" className="flex items-center space-x-2">
            <Search className="w-4 h-4" />
            <span>Manual</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="natural" className="mt-4">
          <NaturalLanguageSearch onFiltersChange={handleNLFiltersChange} />
        </TabsContent>
        
        <TabsContent value="manual" className="mt-4 space-y-6">
          <SearchInput
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onClear={clearSearch}
          />

          <ActiveFiltersSummary
            filterSettings={filterSettings}
            statusFilter={statusFilter}
            searchTerm={searchTerm}
            activeFiltersCount={getActiveFiltersCount()}
            onClearAll={handleClearAll}
          />

          <NodeTypeFilters
            filterSettings={filterSettings}
            setFilterSettings={setFilterSettings}
          />

          <StatusFilters
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
          />

          <QuickActions />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SearchAndFilters;
