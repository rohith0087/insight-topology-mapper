
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface ExecutiveMetrics {
  overview: {
    total_nodes: number;
    critical_nodes: number;
    healthy_nodes: number;
    total_connections: number;
  };
  kpis: Array<{
    title: string;
    value: number;
    unit: string;
    trend: {
      trend: 'up' | 'down' | 'stable';
      change: number;
    };
    target: number;
    status: 'excellent' | 'good' | 'needs_attention';
  }>;
  financial: {
    cost_savings: number;
    incidents_resolved: number;
    estimated_roi: number;
  };
  alerts: {
    critical: number;
    high_priority: number;
    total_active: number;
  };
}

export const useExecutiveMetrics = () => {
  return useQuery({
    queryKey: ['executive-metrics'],
    queryFn: async (): Promise<ExecutiveMetrics> => {
      console.log('Fetching executive metrics...');
      
      const { data, error } = await supabase.functions.invoke('executive-metrics');

      if (error) {
        console.error('Executive metrics error:', error);
        throw error;
      }

      console.log('Executive metrics data:', data);
      return data.metrics;
    },
    refetchInterval: 5 * 60 * 1000, // Refresh every 5 minutes
    staleTime: 2 * 60 * 1000, // Consider data stale after 2 minutes
  });
};
