
import React, { useState } from 'react';
import SearchInput from './SearchInput';
import ActiveFiltersSummary from './ActiveFiltersSummary';
import NodeTypeFilters from './NodeTypeFilters';
import StatusFilters from './StatusFilters';
import QuickActions from './QuickActions';

interface SearchAndFiltersProps {
  filterSettings: {
    showDevices: boolean;
    showServices: boolean;
    showApplications: boolean;
    showCloudResources: boolean;
    showConnections: boolean;
  };
  setFilterSettings: (settings: any) => void;
  statusFilter?: string;
  setStatusFilter?: (filter: string) => void;
  searchTerm?: string;
  setSearchTerm?: (term: string) => void;
}

const SearchAndFilters: React.FC<SearchAndFiltersProps> = ({
  filterSettings,
  setFilterSettings,
  statusFilter: externalStatusFilter,
  setStatusFilter: externalSetStatusFilter,
  searchTerm: externalSearchTerm,
  setSearchTerm: externalSetSearchTerm
}) => {
  const [internalSearchTerm, setInternalSearchTerm] = useState('');
  const [internalStatusFilter, setInternalStatusFilter] = useState('all');

  // Use external state if provided, otherwise use internal state
  const searchTerm = externalSearchTerm !== undefined ? externalSearchTerm : internalSearchTerm;
  const setSearchTerm = externalSetSearchTerm || setInternalSearchTerm;
  const statusFilter = externalStatusFilter !== undefined ? externalStatusFilter : internalStatusFilter;
  const setStatusFilter = externalSetStatusFilter || setInternalStatusFilter;

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

  return (
    <div className="space-y-6">
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

      <QuickActions 
        setStatusFilter={setStatusFilter}
        onShowCritical={() => console.log('Critical nodes filter applied')}
        onNetworkOverview={() => console.log('Network overview requested')}
        onRecentChanges={() => console.log('Recent changes requested')}
      />
    </div>
  );
};

export default SearchAndFilters;
