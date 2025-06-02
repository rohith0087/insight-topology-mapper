
import React from 'react';
import { Search, X } from 'lucide-react';
import { Input } from './ui/input';

interface SearchInputProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onClear: () => void;
}

const SearchInput: React.FC<SearchInputProps> = ({
  searchTerm,
  setSearchTerm,
  onClear
}) => {
  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
        <Input
          placeholder="Search nodes, IPs, services..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-slate-900 border-slate-600 text-white placeholder-slate-400 focus:border-cyan-500 focus:ring-cyan-500"
        />
        {searchTerm && (
          <button
            onClick={onClear}
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
  );
};

export default SearchInput;
