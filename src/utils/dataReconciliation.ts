
import { supabase } from '@/integrations/supabase/client';
import { DataConflict, DataLineage, DataSourcePriority, ReconciliationResult, ReconciliationConfig } from '@/types/dataReconciliation';
import crypto from 'crypto';

export class DataReconciliationEngine {
  private config: ReconciliationConfig;

  constructor(config: ReconciliationConfig) {
    this.config = config;
  }

  // Generate hash for data comparison
  private generateDataHash(data: any): string {
    const normalizedData = JSON.stringify(data, Object.keys(data).sort());
    return crypto.createHash('sha256').update(normalizedData).digest('hex');
  }

  // Calculate confidence score based on source priority and data quality
  private calculateConfidenceScore(
    sourceId: string,
    sourcePriorities: Record<string, DataSourcePriority>,
    fieldName: string,
    dataFreshness: number,
    dataCompleteness: number
  ): number {
    const priority = sourcePriorities[sourceId];
    if (!priority) return 0.5;

    const baseScore = priority.priority_level / 10; // Normalize to 0-1
    const fieldMultiplier = priority.field_specific_priorities[fieldName] || 1;
    const freshnessBonus = Math.max(0, 1 - dataFreshness / (24 * 60 * 60 * 1000)); // Fresher data gets bonus
    const completenessBonus = dataCompleteness;

    return Math.min(1, (baseScore * fieldMultiplier * priority.confidence_multiplier + freshnessBonus * 0.1 + completenessBonus * 0.1));
  }

  // Detect conflicts between data sources
  private detectConflicts(
    fieldName: string,
    sourceData: Record<string, any>,
    sourcePriorities: Record<string, DataSourcePriority>
  ): DataConflict[] {
    const conflicts: DataConflict[] = [];
    const values = Object.values(sourceData);
    const uniqueValues = [...new Set(values.map(v => JSON.stringify(v)))];

    if (uniqueValues.length > 1) {
      // Value mismatch detected
      conflicts.push({
        id: crypto.randomUUID(),
        field_name: fieldName,
        conflict_type: 'value_mismatch',
        source_values: sourceData,
        status: 'pending',
        created_at: new Date().toISOString(),
        tenant_id: null
      });
    }

    return conflicts;
  }

  // Resolve conflicts using different strategies
  private resolveConflict(
    conflict: DataConflict,
    sourcePriorities: Record<string, DataSourcePriority>,
    strategy: string
  ): any {
    const { source_values } = conflict;

    switch (strategy) {
      case 'priority_based':
        return this.resolvePriorityBased(source_values, sourcePriorities);
      
      case 'timestamp_based':
        return this.resolveTimestampBased(source_values);
      
      case 'confidence_based':
        return this.resolveConfidenceBased(source_values, sourcePriorities, conflict.field_name);
      
      case 'consensus_based':
        return this.resolveConsensusBased(source_values);
      
      default:
        return this.resolvePriorityBased(source_values, sourcePriorities);
    }
  }

  private resolvePriorityBased(
    sourceValues: Record<string, any>,
    sourcePriorities: Record<string, DataSourcePriority>
  ): any {
    let highestPriority = 0;
    let resolvedValue = null;

    for (const [sourceId, value] of Object.entries(sourceValues)) {
      const priority = sourcePriorities[sourceId]?.priority_level || 1;
      if (priority > highestPriority) {
        highestPriority = priority;
        resolvedValue = value;
      }
    }

    return resolvedValue;
  }

  private resolveTimestampBased(sourceValues: Record<string, any>): any {
    // Assuming timestamps are embedded in the data or we use current time
    const entries = Object.entries(sourceValues);
    if (entries.length === 0) return null;
    
    // For simplicity, return the last entry (could be enhanced with actual timestamps)
    return entries[entries.length - 1][1];
  }

  private resolveConfidenceBased(
    sourceValues: Record<string, any>,
    sourcePriorities: Record<string, DataSourcePriority>,
    fieldName: string
  ): any {
    let highestConfidence = 0;
    let resolvedValue = null;

    for (const [sourceId, value] of Object.entries(sourceValues)) {
      const confidence = this.calculateConfidenceScore(
        sourceId,
        sourcePriorities,
        fieldName,
        0, // dataFreshness - would need actual timestamp
        1  // dataCompleteness - would need actual analysis
      );

      if (confidence > highestConfidence) {
        highestConfidence = confidence;
        resolvedValue = value;
      }
    }

    return resolvedValue;
  }

  private resolveConsensusBased(sourceValues: Record<string, any>): any {
    // Find the most common value
    const valueCounts: Record<string, number> = {};
    
    for (const value of Object.values(sourceValues)) {
      const valueStr = JSON.stringify(value);
      valueCounts[valueStr] = (valueCounts[valueStr] || 0) + 1;
    }

    let maxCount = 0;
    let consensusValue = null;

    for (const [valueStr, count] of Object.entries(valueCounts)) {
      if (count > maxCount) {
        maxCount = count;
        consensusValue = JSON.parse(valueStr);
      }
    }

    return consensusValue;
  }

  // Main reconciliation method
  async reconcileData(
    entityId: string,
    entityType: 'node' | 'connection',
    incomingData: Record<string, any>,
    sourceId: string
  ): Promise<ReconciliationResult> {
    try {
      // Get source priorities
      const { data: priorities } = await supabase
        .from('data_source_priorities')
        .select('*');

      const sourcePriorities = (priorities || []).reduce((acc, p) => {
        acc[p.data_source_id] = p;
        return acc;
      }, {} as Record<string, DataSourcePriority>);

      // Get existing lineage data
      const lineageQuery = supabase
        .from('data_lineage')
        .select('*');

      if (entityType === 'node') {
        lineageQuery.eq('node_id', entityId);
      } else {
        lineageQuery.eq('connection_id', entityId);
      }

      const { data: existingLineage } = await lineageQuery;

      // Group existing data by field
      const existingDataByField: Record<string, Record<string, any>> = {};
      (existingLineage || []).forEach(record => {
        if (!existingDataByField[record.field_name]) {
          existingDataByField[record.field_name] = {};
        }
        existingDataByField[record.field_name][record.data_source_id] = record.field_value;
      });

      const conflicts: DataConflict[] = [];
      const lineageRecords: DataLineage[] = [];
      const reconciledData: Record<string, any> = {};
      let totalConfidence = 0;
      let fieldCount = 0;

      // Process each field in incoming data
      for (const [fieldName, fieldValue] of Object.entries(incomingData)) {
        fieldCount++;

        // Add current source data to field data
        const fieldData = {
          ...existingDataByField[fieldName],
          [sourceId]: fieldValue
        };

        // Detect conflicts
        const fieldConflicts = this.detectConflicts(fieldName, fieldData, sourcePriorities);
        conflicts.push(...fieldConflicts);

        // Resolve conflicts if any
        let resolvedValue = fieldValue;
        if (fieldConflicts.length > 0) {
          const strategy = this.config.field_strategies[fieldName] || this.config.default_strategy;
          resolvedValue = this.resolveConflict(fieldConflicts[0], sourcePriorities, strategy);
        }

        reconciledData[fieldName] = resolvedValue;

        // Calculate confidence for this field
        const confidence = this.calculateConfidenceScore(
          sourceId,
          sourcePriorities,
          fieldName,
          0, // Would need actual timestamp calculation
          1  // Would need actual completeness analysis
        );
        totalConfidence += confidence;

        // Create lineage record
        const lineageRecord: Partial<DataLineage> = {
          data_source_id: sourceId,
          field_name: fieldName,
          field_value: fieldValue,
          confidence_score: confidence,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        if (entityType === 'node') {
          lineageRecord.node_id = entityId;
        } else {
          lineageRecord.connection_id = entityId;
        }

        lineageRecords.push(lineageRecord as DataLineage);
      }

      // Determine primary source (highest priority source that contributed data)
      let primarySourceId = sourceId;
      let highestPriority = sourcePriorities[sourceId]?.priority_level || 1;

      for (const sId of Object.keys(existingDataByField)) {
        const priority = sourcePriorities[sId]?.priority_level || 1;
        if (priority > highestPriority) {
          highestPriority = priority;
          primarySourceId = sId;
        }
      }

      return {
        reconciled_data: reconciledData,
        conflicts_detected: conflicts,
        lineage_records: lineageRecords,
        confidence_score: fieldCount > 0 ? totalConfidence / fieldCount : 0.5,
        primary_source_id: primarySourceId
      };
    } catch (error) {
      console.error('Data reconciliation error:', error);
      throw error;
    }
  }

  // Store reconciliation results
  async storeReconciliationResults(
    entityId: string,
    entityType: 'node' | 'connection',
    results: ReconciliationResult
  ): Promise<void> {
    try {
      // Store lineage records
      if (results.lineage_records.length > 0) {
        const { error: lineageError } = await supabase
          .from('data_lineage')
          .insert(results.lineage_records);

        if (lineageError) throw lineageError;
      }

      // Store conflicts
      if (results.conflicts_detected.length > 0) {
        const conflictsToStore = results.conflicts_detected.map(conflict => ({
          ...conflict,
          [entityType === 'node' ? 'node_id' : 'connection_id']: entityId
        }));

        const { error: conflictError } = await supabase
          .from('data_conflicts')
          .insert(conflictsToStore);

        if (conflictError) throw conflictError;
      }

      // Update entity with reconciliation metadata
      const dataHash = this.generateDataHash(results.reconciled_data);
      const updateData = {
        confidence_score: results.confidence_score,
        primary_source_id: results.primary_source_id,
        data_hash: dataHash,
        last_reconciled: new Date().toISOString(),
        metadata: results.reconciled_data
      };

      const table = entityType === 'node' ? 'network_nodes' : 'network_connections';
      const { error: updateError } = await supabase
        .from(table)
        .update(updateData)
        .eq('id', entityId);

      if (updateError) throw updateError;

    } catch (error) {
      console.error('Error storing reconciliation results:', error);
      throw error;
    }
  }
}

// Default reconciliation configuration
export const DEFAULT_RECONCILIATION_CONFIG: ReconciliationConfig = {
  default_strategy: 'priority_based',
  confidence_threshold: 0.7,
  field_strategies: {
    'ip_address': 'priority_based',
    'hostname': 'consensus_based',
    'status': 'timestamp_based',
    'location': 'confidence_based'
  },
  auto_resolve_threshold: 0.8
};

// Factory function to create reconciliation engine
export function createReconciliationEngine(config?: Partial<ReconciliationConfig>): DataReconciliationEngine {
  const finalConfig = { ...DEFAULT_RECONCILIATION_CONFIG, ...config };
  return new DataReconciliationEngine(finalConfig);
}
