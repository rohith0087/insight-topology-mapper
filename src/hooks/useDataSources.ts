
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useDataSources = () => {
  return useQuery({
    queryKey: ['data-sources'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('data_sources')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });
};

export const useETLJobs = () => {
  return useQuery({
    queryKey: ['etl-jobs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('etl_jobs')
        .select(`
          *,
          data_sources(name, type)
        `)
        .order('started_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      return data;
    },
    refetchInterval: 5000, // Refetch every 5 seconds to see job progress
  });
};

export const useRunETL = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await supabase.functions.invoke('etl-orchestrator', {
        method: 'POST'
      });

      if (response.error) throw response.error;
      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch relevant queries
      queryClient.invalidateQueries({ queryKey: ['data-sources'] });
      queryClient.invalidateQueries({ queryKey: ['etl-jobs'] });
      queryClient.invalidateQueries({ queryKey: ['network-topology'] });
    },
  });
};

export const useRunIndividualETL = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (dataSourceId: string) => {
      const response = await supabase.functions.invoke('etl-orchestrator', {
        method: 'POST',
        headers: {
          'data-source-id': dataSourceId
        }
      });

      if (response.error) throw response.error;
      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch relevant queries
      queryClient.invalidateQueries({ queryKey: ['data-sources'] });
      queryClient.invalidateQueries({ queryKey: ['etl-jobs'] });
      queryClient.invalidateQueries({ queryKey: ['network-topology'] });
    },
  });
};
