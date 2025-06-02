
import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface NLSearchFilters {
  showDevices: boolean;
  showServices: boolean;
  showApplications: boolean;
  showCloudResources: boolean;
  showConnections: boolean;
  statusFilter: 'all' | 'healthy' | 'warning' | 'critical';
  searchTerm: string;
  customFilters: Record<string, any>;
}

interface NLSearchResult {
  filters: NLSearchFilters;
  description: string;
  saved_query_id?: string;
}

export const useNaturalLanguageSearch = () => {
  const { toast } = useToast();
  const [lastResult, setLastResult] = useState<NLSearchResult | null>(null);

  const searchMutation = useMutation({
    mutationFn: async (query: string): Promise<NLSearchResult> => {
      console.log('Processing natural language query:', query);
      
      const { data, error } = await supabase.functions.invoke('natural-language-processor', {
        body: { query }
      });

      if (error) {
        console.error('NL search error:', error);
        throw error;
      }

      console.log('NL search result:', data);
      return {
        filters: data.filters,
        description: data.description,
        saved_query_id: data.saved_query_id
      };
    },
    onSuccess: (data) => {
      setLastResult(data);
      toast({
        title: "Query Processed",
        description: data.description,
      });
    },
    onError: (error) => {
      console.error('Natural language search failed:', error);
      toast({
        title: "Search Failed",
        description: error.message || "Failed to process your query",
        variant: "destructive",
      });
    },
  });

  // Get recent queries
  const { data: recentQueries, refetch: refetchQueries } = useQuery({
    queryKey: ['recent-nl-queries'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('natural_language_queries')
        .select('*')
        .order('last_executed_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data;
    },
  });

  // Get saved queries
  const { data: savedQueries, refetch: refetchSaved } = useQuery({
    queryKey: ['saved-queries'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('saved_queries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const saveQuery = async (queryName: string, queryText: string, filters: NLSearchFilters) => {
    const { error } = await supabase
      .from('saved_queries')
      .insert({
        query_name: queryName,
        query_text: queryText,
        filters: filters,
        is_favorite: false
      });

    if (error) throw error;
    await refetchSaved();
    
    toast({
      title: "Query Saved",
      description: `"${queryName}" has been saved to your queries`,
    });
  };

  const deleteQuery = async (queryId: string) => {
    const { error } = await supabase
      .from('saved_queries')
      .delete()
      .eq('id', queryId);

    if (error) throw error;
    await refetchSaved();
    
    toast({
      title: "Query Deleted",
      description: "Query has been removed from your saved queries",
    });
  };

  return {
    search: searchMutation.mutateAsync,
    isSearching: searchMutation.isPending,
    lastResult,
    recentQueries,
    savedQueries,
    saveQuery,
    deleteQuery,
    refetchQueries,
    refetchSaved
  };
};
