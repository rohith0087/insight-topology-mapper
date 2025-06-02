
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SuperAdminStats {
  total_tenants: number;
  active_tenants: number;
  total_users: number;
  total_data_sources: number;
  open_tickets: number;
  last_updated: string;
}

export const useSuperAdminStats = () => {
  const [stats, setStats] = useState<SuperAdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: rpcError } = await supabase.rpc('get_tenant_statistics');

      if (rpcError) {
        throw rpcError;
      }

      // Type assertion since we know the structure from our database function
      const typedStats = data as SuperAdminStats;
      setStats(typedStats);
    } catch (err: any) {
      console.error('Error fetching super admin stats:', err);
      setError(err.message || 'Failed to fetch statistics');
      toast({
        title: "Error",
        description: "Failed to fetch platform statistics",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    
    // Refresh stats every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
  };
};
