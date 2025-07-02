export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      credential_audit_log: {
        Row: {
          action: string
          credential_id: string
          id: string
          ip_address: unknown | null
          metadata: Json | null
          performed_at: string
          performed_by: string | null
          tenant_id: string
          user_agent: string | null
        }
        Insert: {
          action: string
          credential_id: string
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          performed_at?: string
          performed_by?: string | null
          tenant_id: string
          user_agent?: string | null
        }
        Update: {
          action?: string
          credential_id?: string
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          performed_at?: string
          performed_by?: string | null
          tenant_id?: string
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "credential_audit_log_credential_id_fkey"
            columns: ["credential_id"]
            isOneToOne: false
            referencedRelation: "encrypted_credentials"
            referencedColumns: ["id"]
          },
        ]
      }
      data_conflicts: {
        Row: {
          conflict_type: string
          connection_id: string | null
          created_at: string
          field_name: string
          id: string
          node_id: string | null
          resolution_strategy: string | null
          resolved_at: string | null
          resolved_by: string | null
          resolved_value: Json | null
          source_values: Json
          status: string
          tenant_id: string | null
        }
        Insert: {
          conflict_type: string
          connection_id?: string | null
          created_at?: string
          field_name: string
          id?: string
          node_id?: string | null
          resolution_strategy?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          resolved_value?: Json | null
          source_values: Json
          status?: string
          tenant_id?: string | null
        }
        Update: {
          conflict_type?: string
          connection_id?: string | null
          created_at?: string
          field_name?: string
          id?: string
          node_id?: string | null
          resolution_strategy?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          resolved_value?: Json | null
          source_values?: Json
          status?: string
          tenant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "data_conflicts_connection_id_fkey"
            columns: ["connection_id"]
            isOneToOne: false
            referencedRelation: "network_connections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "data_conflicts_node_id_fkey"
            columns: ["node_id"]
            isOneToOne: false
            referencedRelation: "network_nodes"
            referencedColumns: ["id"]
          },
        ]
      }
      data_lineage: {
        Row: {
          confidence_score: number | null
          connection_id: string | null
          created_at: string
          data_source_id: string
          field_name: string
          field_value: Json
          id: string
          node_id: string | null
          tenant_id: string | null
          updated_at: string
        }
        Insert: {
          confidence_score?: number | null
          connection_id?: string | null
          created_at?: string
          data_source_id: string
          field_name: string
          field_value: Json
          id?: string
          node_id?: string | null
          tenant_id?: string | null
          updated_at?: string
        }
        Update: {
          confidence_score?: number | null
          connection_id?: string | null
          created_at?: string
          data_source_id?: string
          field_name?: string
          field_value?: Json
          id?: string
          node_id?: string | null
          tenant_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "data_lineage_connection_id_fkey"
            columns: ["connection_id"]
            isOneToOne: false
            referencedRelation: "network_connections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "data_lineage_data_source_id_fkey"
            columns: ["data_source_id"]
            isOneToOne: false
            referencedRelation: "data_sources"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "data_lineage_node_id_fkey"
            columns: ["node_id"]
            isOneToOne: false
            referencedRelation: "network_nodes"
            referencedColumns: ["id"]
          },
        ]
      }
      data_quality_metrics: {
        Row: {
          calculated_at: string
          data_source_id: string
          id: string
          metadata: Json | null
          metric_name: string
          metric_type: string
          metric_value: number
          tenant_id: string | null
        }
        Insert: {
          calculated_at?: string
          data_source_id: string
          id?: string
          metadata?: Json | null
          metric_name: string
          metric_type: string
          metric_value: number
          tenant_id?: string | null
        }
        Update: {
          calculated_at?: string
          data_source_id?: string
          id?: string
          metadata?: Json | null
          metric_name?: string
          metric_type?: string
          metric_value?: number
          tenant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "data_quality_metrics_data_source_id_fkey"
            columns: ["data_source_id"]
            isOneToOne: false
            referencedRelation: "data_sources"
            referencedColumns: ["id"]
          },
        ]
      }
      data_source_priorities: {
        Row: {
          confidence_multiplier: number | null
          created_at: string
          data_source_id: string
          field_specific_priorities: Json | null
          id: string
          priority_level: number
          tenant_id: string | null
          updated_at: string
        }
        Insert: {
          confidence_multiplier?: number | null
          created_at?: string
          data_source_id: string
          field_specific_priorities?: Json | null
          id?: string
          priority_level: number
          tenant_id?: string | null
          updated_at?: string
        }
        Update: {
          confidence_multiplier?: number | null
          created_at?: string
          data_source_id?: string
          field_specific_priorities?: Json | null
          id?: string
          priority_level?: number
          tenant_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "data_source_priorities_data_source_id_fkey"
            columns: ["data_source_id"]
            isOneToOne: false
            referencedRelation: "data_sources"
            referencedColumns: ["id"]
          },
        ]
      }
      data_sources: {
        Row: {
          config: Json
          created_at: string | null
          credential_id: string | null
          enabled: boolean | null
          id: string
          last_sync: string | null
          name: string
          sync_interval: number | null
          sync_status: string | null
          tenant_id: string | null
          type: string
          updated_at: string | null
        }
        Insert: {
          config?: Json
          created_at?: string | null
          credential_id?: string | null
          enabled?: boolean | null
          id?: string
          last_sync?: string | null
          name: string
          sync_interval?: number | null
          sync_status?: string | null
          tenant_id?: string | null
          type: string
          updated_at?: string | null
        }
        Update: {
          config?: Json
          created_at?: string | null
          credential_id?: string | null
          enabled?: boolean | null
          id?: string
          last_sync?: string | null
          name?: string
          sync_interval?: number | null
          sync_status?: string | null
          tenant_id?: string | null
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "data_sources_credential_id_fkey"
            columns: ["credential_id"]
            isOneToOne: false
            referencedRelation: "encrypted_credentials"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "data_sources_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      encrypted_credentials: {
        Row: {
          created_at: string
          created_by: string | null
          credential_name: string
          credential_type: string
          encrypted_data: Json
          id: string
          is_active: boolean
          last_used: string | null
          tenant_id: string
          updated_at: string
          version: number
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          credential_name: string
          credential_type: string
          encrypted_data: Json
          id?: string
          is_active?: boolean
          last_used?: string | null
          tenant_id: string
          updated_at?: string
          version?: number
        }
        Update: {
          created_at?: string
          created_by?: string | null
          credential_name?: string
          credential_type?: string
          encrypted_data?: Json
          id?: string
          is_active?: boolean
          last_used?: string | null
          tenant_id?: string
          updated_at?: string
          version?: number
        }
        Relationships: []
      }
      etl_jobs: {
        Row: {
          completed_at: string | null
          data_source_id: string | null
          error_details: Json | null
          errors_count: number | null
          id: string
          job_type: string
          metadata: Json | null
          records_processed: number | null
          started_at: string | null
          status: string
          tenant_id: string | null
        }
        Insert: {
          completed_at?: string | null
          data_source_id?: string | null
          error_details?: Json | null
          errors_count?: number | null
          id?: string
          job_type: string
          metadata?: Json | null
          records_processed?: number | null
          started_at?: string | null
          status?: string
          tenant_id?: string | null
        }
        Update: {
          completed_at?: string | null
          data_source_id?: string | null
          error_details?: Json | null
          errors_count?: number | null
          id?: string
          job_type?: string
          metadata?: Json | null
          records_processed?: number | null
          started_at?: string | null
          status?: string
          tenant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "etl_jobs_data_source_id_fkey"
            columns: ["data_source_id"]
            isOneToOne: false
            referencedRelation: "data_sources"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "etl_jobs_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      executive_metrics: {
        Row: {
          calculation_date: string
          created_at: string | null
          id: string
          metric_type: string
          metric_value: Json
          tenant_id: string
        }
        Insert: {
          calculation_date?: string
          created_at?: string | null
          id?: string
          metric_type: string
          metric_value: Json
          tenant_id: string
        }
        Update: {
          calculation_date?: string
          created_at?: string | null
          id?: string
          metric_type?: string
          metric_value?: Json
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "executive_metrics_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      natural_language_queries: {
        Row: {
          created_at: string | null
          execution_count: number | null
          id: string
          last_executed_at: string | null
          query_text: string
          tenant_id: string
          translated_filters: Json
          user_id: string
        }
        Insert: {
          created_at?: string | null
          execution_count?: number | null
          id?: string
          last_executed_at?: string | null
          query_text: string
          tenant_id: string
          translated_filters: Json
          user_id: string
        }
        Update: {
          created_at?: string | null
          execution_count?: number | null
          id?: string
          last_executed_at?: string | null
          query_text?: string
          tenant_id?: string
          translated_filters?: Json
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "natural_language_queries_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      network_connections: {
        Row: {
          confidence_score: number | null
          connection_type: string
          data_hash: string | null
          discovered_at: string | null
          id: string
          last_reconciled: string | null
          last_verified: string | null
          metadata: Json | null
          port: number | null
          primary_source_id: string | null
          protocol: string | null
          source_node_id: string | null
          target_node_id: string | null
          tenant_id: string | null
        }
        Insert: {
          confidence_score?: number | null
          connection_type?: string
          data_hash?: string | null
          discovered_at?: string | null
          id?: string
          last_reconciled?: string | null
          last_verified?: string | null
          metadata?: Json | null
          port?: number | null
          primary_source_id?: string | null
          protocol?: string | null
          source_node_id?: string | null
          target_node_id?: string | null
          tenant_id?: string | null
        }
        Update: {
          confidence_score?: number | null
          connection_type?: string
          data_hash?: string | null
          discovered_at?: string | null
          id?: string
          last_reconciled?: string | null
          last_verified?: string | null
          metadata?: Json | null
          port?: number | null
          primary_source_id?: string | null
          protocol?: string | null
          source_node_id?: string | null
          target_node_id?: string | null
          tenant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "network_connections_primary_source_id_fkey"
            columns: ["primary_source_id"]
            isOneToOne: false
            referencedRelation: "data_sources"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "network_connections_source_node_id_fkey"
            columns: ["source_node_id"]
            isOneToOne: false
            referencedRelation: "network_nodes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "network_connections_target_node_id_fkey"
            columns: ["target_node_id"]
            isOneToOne: false
            referencedRelation: "network_nodes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "network_connections_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      network_nodes: {
        Row: {
          confidence_score: number | null
          created_at: string | null
          data_hash: string | null
          external_id: string
          id: string
          label: string
          last_reconciled: string | null
          last_seen: string | null
          metadata: Json
          node_type: string
          primary_source_id: string | null
          source_system: string
          status: string
          tenant_id: string | null
          updated_at: string | null
        }
        Insert: {
          confidence_score?: number | null
          created_at?: string | null
          data_hash?: string | null
          external_id: string
          id?: string
          label: string
          last_reconciled?: string | null
          last_seen?: string | null
          metadata?: Json
          node_type: string
          primary_source_id?: string | null
          source_system: string
          status?: string
          tenant_id?: string | null
          updated_at?: string | null
        }
        Update: {
          confidence_score?: number | null
          created_at?: string | null
          data_hash?: string | null
          external_id?: string
          id?: string
          label?: string
          last_reconciled?: string | null
          last_seen?: string | null
          metadata?: Json
          node_type?: string
          primary_source_id?: string | null
          source_system?: string
          status?: string
          tenant_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "network_nodes_primary_source_id_fkey"
            columns: ["primary_source_id"]
            isOneToOne: false
            referencedRelation: "data_sources"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "network_nodes_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string
          first_name: string | null
          id: string
          is_active: boolean | null
          last_login: string | null
          last_name: string | null
          metadata: Json | null
          role: Database["public"]["Enums"]["user_role"] | null
          tenant_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          first_name?: string | null
          id: string
          is_active?: boolean | null
          last_login?: string | null
          last_name?: string | null
          metadata?: Json | null
          role?: Database["public"]["Enums"]["user_role"] | null
          tenant_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          first_name?: string | null
          id?: string
          is_active?: boolean | null
          last_login?: string | null
          last_name?: string | null
          metadata?: Json | null
          role?: Database["public"]["Enums"]["user_role"] | null
          tenant_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      saved_queries: {
        Row: {
          created_at: string | null
          filters: Json
          id: string
          is_favorite: boolean | null
          query_name: string
          query_text: string
          tenant_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          filters: Json
          id?: string
          is_favorite?: boolean | null
          query_name: string
          query_text: string
          tenant_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          filters?: Json
          id?: string
          is_favorite?: boolean | null
          query_name?: string
          query_text?: string
          tenant_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_queries_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      support_admins: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          last_login: string | null
          password_hash: string
          role: Database["public"]["Enums"]["support_role"]
          updated_at: string
          username: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          last_login?: string | null
          password_hash: string
          role?: Database["public"]["Enums"]["support_role"]
          updated_at?: string
          username: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          last_login?: string | null
          password_hash?: string
          role?: Database["public"]["Enums"]["support_role"]
          updated_at?: string
          username?: string
        }
        Relationships: []
      }
      support_tickets: {
        Row: {
          assigned_to: string | null
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          metadata: Json | null
          priority: string
          resolved_at: string | null
          status: string
          tags: Json | null
          tenant_id: string
          title: string
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          priority?: string
          resolved_at?: string | null
          status?: string
          tags?: Json | null
          tenant_id: string
          title: string
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          priority?: string
          resolved_at?: string | null
          status?: string
          tags?: Json | null
          tenant_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "support_tickets_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      tenant_health_metrics: {
        Row: {
          created_at: string
          id: string
          metric_type: string
          metric_value: Json
          recorded_at: string
          tenant_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          metric_type: string
          metric_value?: Json
          recorded_at?: string
          tenant_id: string
        }
        Update: {
          created_at?: string
          id?: string
          metric_type?: string
          metric_value?: Json
          recorded_at?: string
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tenant_health_metrics_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      tenants: {
        Row: {
          company_name: string | null
          created_at: string | null
          domain: string | null
          id: string
          is_active: boolean | null
          metadata: Json | null
          name: string
          slug: string
          updated_at: string | null
        }
        Insert: {
          company_name?: string | null
          created_at?: string | null
          domain?: string | null
          id?: string
          is_active?: boolean | null
          metadata?: Json | null
          name: string
          slug: string
          updated_at?: string | null
        }
        Update: {
          company_name?: string | null
          created_at?: string | null
          domain?: string | null
          id?: string
          is_active?: boolean | null
          metadata?: Json | null
          name?: string
          slug?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      user_invitations: {
        Row: {
          created_at: string | null
          email: string | null
          expires_at: string
          id: string
          invite_token: string
          invited_by: string
          role: Database["public"]["Enums"]["user_role"]
          tenant_id: string
          used: boolean | null
          used_at: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          expires_at?: string
          id?: string
          invite_token?: string
          invited_by: string
          role: Database["public"]["Enums"]["user_role"]
          tenant_id: string
          used?: boolean | null
          used_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          expires_at?: string
          id?: string
          invite_token?: string
          invited_by?: string
          role?: Database["public"]["Enums"]["user_role"]
          tenant_id?: string
          used?: boolean | null
          used_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_invitations_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_invitations_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      user_onboarding: {
        Row: {
          completed_at: string | null
          completed_steps: Json | null
          current_step: number | null
          id: string
          is_completed: boolean | null
          onboarding_data: Json | null
          started_at: string | null
          tenant_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          completed_steps?: Json | null
          current_step?: number | null
          id?: string
          is_completed?: boolean | null
          onboarding_data?: Json | null
          started_at?: string | null
          tenant_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          completed_at?: string | null
          completed_steps?: Json | null
          current_step?: number | null
          id?: string
          is_completed?: boolean | null
          onboarding_data?: Json | null
          started_at?: string | null
          tenant_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_onboarding_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      user_settings: {
        Row: {
          created_at: string
          id: string
          settings_key: string
          settings_value: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          settings_key: string
          settings_value?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          settings_key?: string
          settings_value?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_executive_metrics: {
        Args: { p_tenant_id: string }
        Returns: Json
      }
      create_support_admin: {
        Args: { p_username: string; p_password: string }
        Returns: string
      }
      create_support_ticket: {
        Args: { p_title: string; p_description: string; p_priority?: string }
        Returns: {
          assigned_to: string | null
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          metadata: Json | null
          priority: string
          resolved_at: string | null
          status: string
          tags: Json | null
          tenant_id: string
          title: string
          updated_at: string
        }
      }
      extract_domain: {
        Args: { email: string }
        Returns: string
      }
      get_tenant_by_domain: {
        Args: { email_domain: string }
        Returns: string
      }
      get_tenant_details_with_health: {
        Args: Record<PropertyKey, never>
        Returns: {
          tenant_id: string
          tenant_name: string
          tenant_slug: string
          company_name: string
          domain: string
          is_active: boolean
          user_count: number
          data_source_count: number
          last_activity: string
          health_score: number
          open_tickets: number
        }[]
      }
      get_tenant_statistics: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_user_role: {
        Args: { user_id: string }
        Returns: Database["public"]["Enums"]["user_role"]
      }
      get_user_setting: {
        Args: { p_settings_key: string }
        Returns: Json
      }
      get_user_tenant: {
        Args: { user_id: string }
        Returns: string
      }
      has_role: {
        Args: {
          user_id: string
          required_role: Database["public"]["Enums"]["user_role"]
        }
        Returns: boolean
      }
      is_valid_company_email: {
        Args: { email: string }
        Returns: boolean
      }
      log_credential_access: {
        Args: { p_credential_id: string; p_action: string; p_metadata?: Json }
        Returns: undefined
      }
      update_onboarding_progress: {
        Args: { p_step: number; p_step_data?: Json }
        Returns: {
          completed_at: string | null
          completed_steps: Json | null
          current_step: number | null
          id: string
          is_completed: boolean | null
          onboarding_data: Json | null
          started_at: string | null
          tenant_id: string
          updated_at: string | null
          user_id: string
        }
      }
      update_ticket_status: {
        Args: { p_ticket_id: string; p_status: string; p_assigned_to?: string }
        Returns: {
          assigned_to: string | null
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          metadata: Json | null
          priority: string
          resolved_at: string | null
          status: string
          tags: Json | null
          tenant_id: string
          title: string
          updated_at: string
        }
      }
      upsert_user_setting: {
        Args: { p_settings_key: string; p_settings_value: Json }
        Returns: {
          created_at: string
          id: string
          settings_key: string
          settings_value: Json
          updated_at: string
          user_id: string
        }
      }
      validate_support_admin: {
        Args: { p_username: string; p_password: string }
        Returns: Json
      }
    }
    Enums: {
      support_role: "super_super_admin"
      user_role:
        | "super_admin"
        | "tenant_admin"
        | "network_admin"
        | "analyst"
        | "viewer"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      support_role: ["super_super_admin"],
      user_role: [
        "super_admin",
        "tenant_admin",
        "network_admin",
        "analyst",
        "viewer",
      ],
    },
  },
} as const
