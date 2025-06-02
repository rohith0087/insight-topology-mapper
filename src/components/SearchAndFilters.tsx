
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

      <QuickActions />
    </div>
  );
};

export default SearchAndFilters;
