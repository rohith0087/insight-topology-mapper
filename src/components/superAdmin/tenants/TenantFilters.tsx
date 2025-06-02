
import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface TenantFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const TenantFilters: React.FC<TenantFiltersProps> = ({ searchTerm, onSearchChange }) => {
  return (
    <div className="relative w-72">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
      <Input
        placeholder="Search clients..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-10 bg-slate-900 border-slate-600 text-white"
      />
    </div>
  );
};

export default TenantFilters;
