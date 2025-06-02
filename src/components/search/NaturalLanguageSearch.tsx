
import React, { useState } from 'react';
import { Search, Sparkles, Clock, Save, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNaturalLanguageSearch } from '@/hooks/useNaturalLanguageSearch';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface NaturalLanguageSearchProps {
  onFiltersChange: (filters: any) => void;
}

const NaturalLanguageSearch: React.FC<NaturalLanguageSearchProps> = ({ onFiltersChange }) => {
  const [query, setQuery] = useState('');
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [saveQueryName, setSaveQueryName] = useState('');
  
  const {
    search,
    isSearching,
    lastResult,
    recentQueries,
    savedQueries,
    saveQuery,
    deleteQuery
  } = useNaturalLanguageSearch();

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    try {
      const result = await search(query);
      onFiltersChange(result.filters);
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSaveQuery = async () => {
    if (!saveQueryName.trim() || !lastResult) return;
    
    try {
      await saveQuery(saveQueryName, query, lastResult.filters);
      setSaveQueryName('');
      setSaveDialogOpen(false);
    } catch (error) {
      console.error('Failed to save query:', error);
    }
  };

  const applySavedQuery = (savedQuery: any) => {
    setQuery(savedQuery.query_text);
    onFiltersChange(savedQuery.filters);
  };

  const example_queries = [
    "Show me all critical servers",
    "Find healthy applications",
    "Display warning status devices",
    "Show cloud resources only",
    "Find devices with high CPU usage"
  ];

  return (
    <div className="space-y-4">
      {/* Main Search Input */}
      <div className="relative">
        <div className="flex space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about your network... (e.g., 'show critical servers')"
              className="pl-10 bg-slate-900 border-slate-600 text-slate-200 placeholder-slate-400"
              disabled={isSearching}
            />
            <Sparkles className="absolute right-3 top-1/2 transform -translate-y-1/2 text-cyan-400 w-4 h-4" />
          </div>
          <Button
            onClick={handleSearch}
            disabled={isSearching || !query.trim()}
            className="bg-cyan-600 hover:bg-cyan-700"
          >
            {isSearching ? 'Processing...' : 'Search'}
          </Button>
        </div>
      </div>

      {/* Last Result */}
      {lastResult && (
        <Card className="bg-slate-800 border-slate-600 p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="border-cyan-500 text-cyan-400">
                AI Result
              </Badge>
              <span className="text-sm text-slate-300">{lastResult.description}</span>
            </div>
            <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                  <Save className="w-4 h-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-slate-800 border-slate-600">
                <DialogHeader>
                  <DialogTitle className="text-slate-200">Save Query</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Input
                    value={saveQueryName}
                    onChange={(e) => setSaveQueryName(e.target.value)}
                    placeholder="Enter a name for this query..."
                    className="bg-slate-900 border-slate-600 text-slate-200"
                  />
                  <div className="flex space-x-2">
                    <Button onClick={handleSaveQuery} disabled={!saveQueryName.trim()}>
                      Save Query
                    </Button>
                    <Button variant="outline" onClick={() => setSaveDialogOpen(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </Card>
      )}

      {/* Example Queries */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-slate-400">Example Queries:</h4>
        <div className="flex flex-wrap gap-2">
          {example_queries.map((example, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => setQuery(example)}
              className="text-xs border-slate-600 hover:border-cyan-500 hover:text-cyan-400"
            >
              {example}
            </Button>
          ))}
        </div>
      </div>

      {/* Recent & Saved Queries */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Queries */}
        {recentQueries && recentQueries.length > 0 && (
          <Card className="bg-slate-800 border-slate-600 p-4">
            <div className="flex items-center space-x-2 mb-3">
              <Clock className="w-4 h-4 text-slate-400" />
              <h4 className="text-sm font-medium text-slate-200">Recent Queries</h4>
            </div>
            <ScrollArea className="h-32">
              <div className="space-y-2">
                {recentQueries.slice(0, 5).map((recentQuery) => (
                  <button
                    key={recentQuery.id}
                    onClick={() => setQuery(recentQuery.query_text)}
                    className="w-full text-left text-sm text-slate-300 hover:text-cyan-400 p-2 rounded hover:bg-slate-700 transition-colors"
                  >
                    {recentQuery.query_text}
                  </button>
                ))}
              </div>
            </ScrollArea>
          </Card>
        )}

        {/* Saved Queries */}
        {savedQueries && savedQueries.length > 0 && (
          <Card className="bg-slate-800 border-slate-600 p-4">
            <div className="flex items-center space-x-2 mb-3">
              <Save className="w-4 h-4 text-slate-400" />
              <h4 className="text-sm font-medium text-slate-200">Saved Queries</h4>
            </div>
            <ScrollArea className="h-32">
              <div className="space-y-2">
                {savedQueries.slice(0, 5).map((savedQuery) => (
                  <div
                    key={savedQuery.id}
                    className="flex items-center justify-between p-2 rounded hover:bg-slate-700"
                  >
                    <button
                      onClick={() => applySavedQuery(savedQuery)}
                      className="flex-1 text-left text-sm text-slate-300 hover:text-cyan-400"
                    >
                      <div className="font-medium">{savedQuery.query_name}</div>
                      <div className="text-xs text-slate-500">{savedQuery.query_text}</div>
                    </button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteQuery(savedQuery.id)}
                      className="text-slate-400 hover:text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </Card>
        )}
      </div>
    </div>
  );
};

export default NaturalLanguageSearch;
