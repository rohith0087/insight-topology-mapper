
export interface DataLineage {
  id: string;
  node_id?: string;
  connection_id?: string;
  data_source_id: string;
  field_name: string;
  field_value: any;
  confidence_score: number;
  created_at: string;
  updated_at: string;
  tenant_id?: string;
}

export interface DataConflict {
  id: string;
  node_id?: string;
  connection_id?: string;
  field_name: string;
  conflict_type: 'value_mismatch' | 'schema_conflict' | 'timestamp_conflict' | 'source_priority_conflict';
  source_values: Record<string, any>;
  resolved_value?: any;
  resolution_strategy?: 'manual' | 'priority_based' | 'timestamp_based' | 'confidence_based' | 'consensus_based';
  status: 'pending' | 'resolved' | 'ignored';
  resolved_by?: string;
  resolved_at?: string;
  created_at: string;
  tenant_id?: string;
}

export interface DataSourcePriority {
  id: string;
  data_source_id: string;
  priority_level: number;
  confidence_multiplier: number;
  field_specific_priorities: Record<string, number>;
  tenant_id?: string;
  created_at: string;
  updated_at: string;
}

export interface DataQualityMetric {
  id: string;
  data_source_id: string;
  metric_name: string;
  metric_value: number;
  metric_type: 'accuracy' | 'completeness' | 'consistency' | 'timeliness' | 'validity';
  calculated_at: string;
  tenant_id?: string;
  metadata: Record<string, any>;
}

export interface ReconciliationResult {
  reconciled_data: any;
  conflicts_detected: DataConflict[];
  lineage_records: DataLineage[];
  confidence_score: number;
  primary_source_id: string;
}

export interface ReconciliationConfig {
  default_strategy: 'priority_based' | 'timestamp_based' | 'confidence_based' | 'consensus_based';
  confidence_threshold: number;
  field_strategies: Record<string, string>;
  auto_resolve_threshold: number;
}
