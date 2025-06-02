import { supabase } from '@/integrations/supabase/client';
import { 
  DataConflict, 
  DataSourcePriority, 
  DataLineage, 
  ReconciliationResult, 
  ReconciliationConfig 
} from '@/types/dataReconciliation';

export const DEFAULT_RECONCILIATION_CONFIG: ReconciliationConfig = {
  default_strategy: 'priority_based',
  confidence_threshold: 0.7,
  field_strategies: {
    'ip_address': 'priority_based',
    'hostname': 'timestamp_based',
    'status': 'confidence_based',
    'metadata': 'consensus_based'
  },
  auto_resolve_threshold: 0.9
};

export class DataReconciliationEngine {
  private config: ReconciliationConfig;

  constructor(config: ReconciliationConfig = DEFAULT_RECONCILIATION_CONFIG) {
    this.config = config;
  }

  async reconcileData(
    entityId: string,
    entityType: 'node' | 'connection',
    incomingData: Record<string, any>,
    sourceId: string
  ): Promise<ReconciliationResult> {
    console.log(`Starting reconciliation for ${entityType} ${entityId} from source ${sourceId}`);
    
    // Get existing data for the entity
    const existingData = await this.getExistingData(entityId, entityType);
    console.log('Existing data:', existingData);
    
    // Get source priorities
    const priorities = await this.getSourcePriorities();
    console.log('Source priorities:', priorities);
    
    // Detect conflicts
    const conflicts = await this.detectConflicts(entityId, entityType, incomingData, existingData);
    console.log('Detected conflicts:', conflicts);
    
    // Resolve conflicts based on strategy
    const resolvedData = await this.resolveConflicts(incomingData, existingData, conflicts, priorities);
    console.log('Resolved data:', resolvedData);
    
    // Calculate confidence score
    const confidenceScore = this.calculateConfidenceScore(resolvedData, priorities, sourceId);
    console.log('Confidence score:', confidenceScore);
    
    // Create lineage records
    const lineageRecords = await this.createLineageRecords(
      entityId, 
      entityType, 
      incomingData, 
      sourceId, 
      confidenceScore
    );
    
    return {
      reconciled_data: resolvedData,
      conflicts_detected: conflicts,
      lineage_records: lineageRecords,
      confidence_score: confidenceScore,
      primary_source_id: this.determinePrimarySource(priorities, sourceId)
    };
  }

  private async getExistingData(entityId: string, entityType: 'node' | 'connection') {
    const table = entityType === 'node' ? 'network_nodes' : 'network_connections';
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .eq('id', entityId)
      .single();
    
    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching existing data:', error);
      return {};
    }
    
    return data || {};
  }

  private async getSourcePriorities(): Promise<Record<string, DataSourcePriority>> {
    const { data, error } = await supabase
      .from('data_source_priorities')
      .select('*');
    
    if (error) {
      console.error('Error fetching source priorities:', error);
      return {};
    }
    
    const priorities: Record<string, DataSourcePriority> = {};
    data?.forEach(priority => {
      // Fix the type conversion issue
      const priorityData: DataSourcePriority = {
        ...priority,
        field_specific_priorities: typeof priority.field_specific_priorities === 'string' 
          ? JSON.parse(priority.field_specific_priorities) 
          : priority.field_specific_priorities || {}
      };
      priorities[priority.data_source_id] = priorityData;
    });
    
    return priorities;
  }

  private async detectConflicts(
    entityId: string,
    entityType: 'node' | 'connection',
    incomingData: Record<string, any>,
    existingData: Record<string, any>
  ): Promise<DataConflict[]> {
    const conflicts: DataConflict[] = [];
    
    for (const [fieldName, newValue] of Object.entries(incomingData)) {
      const existingValue = existingData[fieldName];
      
      if (existingValue !== undefined && existingValue !== newValue) {
        const conflictData: DataConflict = {
          id: crypto.randomUUID(),
          field_name: fieldName,
          conflict_type: 'value_mismatch' as const,
          source_values: {
            existing: existingValue,
            incoming: newValue
          },
          status: 'pending' as const,
          created_at: new Date().toISOString()
        };

        // Add the appropriate entity ID based on entity type
        if (entityType === 'node') {
          conflictData.node_id = entityId;
        } else {
          conflictData.connection_id = entityId;
        }
        
        conflicts.push(conflictData);
      }
    }
    
    return conflicts;
  }

  private async resolveConflicts(
    incomingData: Record<string, any>,
    existingData: Record<string, any>,
    conflicts: DataConflict[],
    priorities: Record<string, DataSourcePriority>
  ): Promise<Record<string, any>> {
    const resolvedData = { ...existingData };
    
    for (const conflict of conflicts) {
      const strategy = this.config.field_strategies[conflict.field_name] || this.config.default_strategy;
      const resolvedValue = this.applyResolutionStrategy(conflict, strategy, priorities);
      resolvedData[conflict.field_name] = resolvedValue;
    }
    
    // Add new fields that don't conflict
    for (const [fieldName, value] of Object.entries(incomingData)) {
      if (!(fieldName in existingData)) {
        resolvedData[fieldName] = value;
      }
    }
    
    return resolvedData;
  }

  private applyResolutionStrategy(
    conflict: DataConflict,
    strategy: string,
    priorities: Record<string, DataSourcePriority>
  ): any {
    switch (strategy) {
      case 'priority_based':
        return this.resolvePriorityBased(conflict, priorities);
      case 'timestamp_based':
        return this.resolveTimestampBased(conflict);
      case 'confidence_based':
        return this.resolveConfidenceBased(conflict);
      case 'consensus_based':
        return this.resolveConsensusBased(conflict);
      default:
        return conflict.source_values.incoming;
    }
  }

  private resolvePriorityBased(conflict: DataConflict, priorities: Record<string, DataSourcePriority>): any {
    // Simple implementation - prefer incoming data if from higher priority source
    return conflict.source_values.incoming;
  }

  private resolveTimestampBased(conflict: DataConflict): any {
    // Prefer newer data
    return conflict.source_values.incoming;
  }

  private resolveConfidenceBased(conflict: DataConflict): any {
    // Implementation would compare confidence scores
    return conflict.source_values.incoming;
  }

  private resolveConsensusBased(conflict: DataConflict): any {
    // Implementation would check multiple sources
    return conflict.source_values.incoming;
  }

  private calculateConfidenceScore(
    data: Record<string, any>,
    priorities: Record<string, DataSourcePriority>,
    sourceId: string
  ): number {
    const sourcePriority = priorities[sourceId];
    if (!sourcePriority) return 0.5;
    
    const baseScore = sourcePriority.priority_level / 10;
    const multiplier = sourcePriority.confidence_multiplier;
    
    return Math.min(1.0, baseScore * multiplier);
  }

  private async createLineageRecords(
    entityId: string,
    entityType: 'node' | 'connection',
    data: Record<string, any>,
    sourceId: string,
    confidenceScore: number
  ): Promise<DataLineage[]> {
    const records: DataLineage[] = [];
    
    for (const [fieldName, fieldValue] of Object.entries(data)) {
      const lineageRecord: DataLineage = {
        id: crypto.randomUUID(),
        data_source_id: sourceId,
        field_name: fieldName,
        field_value: fieldValue,
        confidence_score: confidenceScore,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Add the appropriate entity ID based on entity type
      if (entityType === 'node') {
        lineageRecord.node_id = entityId;
      } else {
        lineageRecord.connection_id = entityId;
      }
      
      records.push(lineageRecord);
    }
    
    return records;
  }

  private determinePrimarySource(priorities: Record<string, DataSourcePriority>, sourceId: string): string {
    return sourceId; // Simplified implementation
  }

  async storeReconciliationResults(
    entityId: string,
    entityType: 'node' | 'connection',
    results: ReconciliationResult
  ): Promise<void> {
    try {
      // Store conflicts
      if (results.conflicts_detected.length > 0) {
        const { error: conflictsError } = await supabase
          .from('data_conflicts')
          .insert(results.conflicts_detected);
        
        if (conflictsError) {
          console.error('Error storing conflicts:', conflictsError);
        }
      }
      
      // Store lineage records
      if (results.lineage_records.length > 0) {
        const { error: lineageError } = await supabase
          .from('data_lineage')
          .insert(results.lineage_records);
        
        if (lineageError) {
          console.error('Error storing lineage:', lineageError);
        }
      }
      
      // Update the main entity with reconciled data
      const table = entityType === 'node' ? 'network_nodes' : 'network_connections';
      const { error: updateError } = await supabase
        .from(table)
        .update({
          ...results.reconciled_data,
          confidence_score: results.confidence_score,
          primary_source_id: results.primary_source_id,
          last_reconciled: new Date().toISOString()
        })
        .eq('id', entityId);
      
      if (updateError) {
        console.error('Error updating entity:', updateError);
      }
      
    } catch (error) {
      console.error('Error in storeReconciliationResults:', error);
      throw error;
    }
  }
}

export const createReconciliationEngine = (config?: ReconciliationConfig) => {
  return new DataReconciliationEngine(config);
};
