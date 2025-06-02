
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useNaturalLanguageSearch } from '@/hooks/useNaturalLanguageSearch';
import { Search, Sparkles, Clock, Star, Trash2 } from 'lucide-react';

interface NaturalLanguageSearchProps {
  onFiltersChange: (filters: any) => void;
}

const NaturalLanguageSearch: React.FC<NaturalLanguageSearchProps> = ({ onFiltersChange }) => {
  const [query, setQuery] = useState('');
  const { 
    search, 
    isSearching, 
    lastResult, 
    recentQueries, 
    savedQueries, 
    saveQuery, 
    deleteQuery 
  } = useNaturalLanguageSearch();

  const exampleQueries = [
    "Show me all critical servers",
    "Find healthy applications in production",
    "Display devices with high CPU usage",
    "Show network connections between AWS and on-premise",
    "Find all services running on port 80"
  ];

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    try {
      const result = await search(query);
      onFiltersChange(result.filters);
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  const handleExampleClick = (exampleQuery: string) => {
    setQuery(exampleQuery);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="flex space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about your network topology..."
            className="pl-10 bg-slate-900 border-slate-600 text-white placeholder-slate-400"
          />
        </div>
        <Button 
          onClick={handleSearch}
          disabled={isSearching || !query.trim()}
          className="bg-cyan-600 hover:bg-cyan-700 text-white"
        >
          {isSearching ? (
            <Sparkles className="w-4 h-4 animate-pulse" />
          ) : (
            <Search className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* Last Result */}
      {lastResult && (
        <Card className="bg-slate-900 border-slate-600">
          <CardContent className="p-4">
            <div className="flex items-start space-x-2">
              <Sparkles className="w-5 h-5 text-cyan-400 mt-0.5" />
              <div>
                <p className="text-slate-200 text-sm">{lastResult.description}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Example Queries */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-slate-300">Example Queries:</h4>
        <div className="space-y-2">
          {exampleQueries.map((example, index) => (
            <button
              key={index}
              onClick={() => handleExampleClick(example)}
              className="w-full text-left p-3 rounded-lg bg-slate-800 border border-slate-600 hover:bg-slate-700 hover:border-slate-500 transition-colors"
            >
              <span className="text-slate-300 text-sm">{example}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Queries */}
      {recentQueries && recentQueries.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-slate-300 flex items-center">
            <Clock className="w-4 h-4 mr-2" />
            Recent Queries
          </h4>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {recentQueries.slice(0, 5).map((recent) => (
              <button
                key={recent.id}
                onClick={() => setQuery(recent.query_text)}
                className="w-full text-left p-2 rounded bg-slate-800 border border-slate-600 hover:bg-slate-700 text-xs text-slate-300"
              >
                {recent.query_text}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Saved Queries */}
      {savedQueries && savedQueries.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-slate-300 flex items-center">
            <Star className="w-4 h-4 mr-2" />
            Saved Queries
          </h4>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {savedQueries.map((saved) => (
              <div key={saved.id} className="flex items-center space-x-2">
                <button
                  onClick={() => setQuery(saved.query_text)}
                  className="flex-1 text-left p-2 rounded bg-slate-800 border border-slate-600 hover:bg-slate-700 text-xs text-slate-300"
                >
                  {saved.query_name}
                </button>
                <Button
                  onClick={() => deleteQuery(saved.id)}
                  variant="ghost"
                  size="sm"
                  className="text-slate-400 hover:text-red-400 p-1"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NaturalLanguageSearch;
