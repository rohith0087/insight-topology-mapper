
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { DataConflict, DataSourcePriority, DataQualityMetric } from '@/types/dataReconciliation';
import { createReconciliationEngine, DEFAULT_RECONCILIATION_CONFIG } from '@/utils/dataReconciliation';

export const useDataConflicts = () => {
  return useQuery({
    queryKey: ['data-conflicts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('data_conflicts')
        .select(`
          *,
          network_nodes(label),
          network_connections(connection_type)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as DataConflict[];
    },
  });
};

export const useDataSourcePriorities = () => {
  return useQuery({
    queryKey: ['data-source-priorities'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('data_source_priorities')
        .select(`
          *,
          data_sources(name, type)
        `)
        .order('priority_level', { ascending: false });

      if (error) throw error;
      return data as DataSourcePriority[];
    },
  });
};

export const useDataQualityMetrics = () => {
  return useQuery({
    queryKey: ['data-quality-metrics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('data_quality_metrics')
        .select(`
          *,
          data_sources(name, type)
        `)
        .order('calculated_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      return data as DataQualityMetric[];
    },
  });
};

export const useResolveConflict = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ 
      conflictId, 
      resolution, 
      strategy 
    }: { 
      conflictId: string; 
      resolution: any; 
      strategy: string; 
    }) => {
      const { error } = await supabase
        .from('data_conflicts')
        .update({
          resolved_value: resolution,
          resolution_strategy: strategy,
          status: 'resolved',
          resolved_at: new Date().toISOString(),
          resolved_by: 'current_user' // Would need actual user ID
        })
        .eq('id', conflictId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['data-conflicts'] });
      toast({
        title: "Conflict Resolved",
        description: "Data conflict has been successfully resolved",
      });
    },
    onError: (error) => {
      toast({
        title: "Resolution Failed",
        description: error.message || "Failed to resolve conflict",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateSourcePriority = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ 
      sourceId, 
      priorityLevel, 
      confidenceMultiplier,
      fieldPriorities 
    }: { 
      sourceId: string; 
      priorityLevel: number;
      confidenceMultiplier: number;
      fieldPriorities: Record<string, number>;
    }) => {
      const { error } = await supabase
        .from('data_source_priorities')
        .upsert({
          data_source_id: sourceId,
          priority_level: priorityLevel,
          confidence_multiplier: confidenceMultiplier,
          field_specific_priorities: fieldPriorities,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['data-source-priorities'] });
      toast({
        title: "Priority Updated",
        description: "Data source priority has been updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update source priority",
        variant: "destructive",
      });
    },
  });
};

export const useReconcileData = () => {
  const { toast } = useToast();
  const reconciliationEngine = createReconciliationEngine();

  return useMutation({
    mutationFn: async ({
      entityId,
      entityType,
      incomingData,
      sourceId
    }: {
      entityId: string;
      entityType: 'node' | 'connection';
      incomingData: Record<string, any>;
      sourceId: string;
    }) => {
      const results = await reconciliationEngine.reconcileData(
        entityId,
        entityType,
        incomingData,
        sourceId
      );

      await reconciliationEngine.storeReconciliationResults(
        entityId,
        entityType,
        results
      );

      return results;
    },
    onSuccess: (results) => {
      toast({
        title: "Data Reconciled",
        description: `Reconciliation completed with ${results.conflicts_detected.length} conflicts detected`,
      });
    },
    onError: (error) => {
      toast({
        title: "Reconciliation Failed",
        description: error.message || "Failed to reconcile data",
        variant: "destructive",
      });
    },
  });
};

export const useDataLineage = (entityId: string, entityType: 'node' | 'connection') => {
  return useQuery({
    queryKey: ['data-lineage', entityId, entityType],
    queryFn: async () => {
      const query = supabase
        .from('data_lineage')
        .select(`
          *,
          data_sources(name, type)
        `)
        .order('created_at', { ascending: false });

      if (entityType === 'node') {
        query.eq('node_id', entityId);
      } else {
        query.eq('connection_id', entityId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    enabled: !!entityId,
  });
};
