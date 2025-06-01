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
      admin_actions: {
        Row: {
          action_data: Json | null
          action_type: string
          admin_id: string
          created_at: string
          customer_id: string
          id: string
          store_id: string
        }
        Insert: {
          action_data?: Json | null
          action_type: string
          admin_id: string
          created_at?: string
          customer_id: string
          id?: string
          store_id: string
        }
        Update: {
          action_data?: Json | null
          action_type?: string
          admin_id?: string
          created_at?: string
          customer_id?: string
          id?: string
          store_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "admin_actions_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "admin_actions_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "admin_actions_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_stores: {
        Row: {
          admin_id: string | null
          created_at: string
          id: string
          store_id: string | null
        }
        Insert: {
          admin_id?: string | null
          created_at?: string
          id?: string
          store_id?: string | null
        }
        Update: {
          admin_id?: string | null
          created_at?: string
          id?: string
          store_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "admin_stores_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "admin_stores_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_admin_stores_store_id"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      api_keys: {
        Row: {
          admin_id: string
          api_key: string
          created_at: string
          expires_at: string | null
          id: string
          is_active: boolean
          key_hash: string
          key_name: string
          last_used_at: string | null
          permissions: Json
          updated_at: string
        }
        Insert: {
          admin_id: string
          api_key: string
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          key_hash: string
          key_name: string
          last_used_at?: string | null
          permissions?: Json
          updated_at?: string
        }
        Update: {
          admin_id?: string
          api_key?: string
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          key_hash?: string
          key_name?: string
          last_used_at?: string | null
          permissions?: Json
          updated_at?: string
        }
        Relationships: []
      }
      api_usage_logs: {
        Row: {
          api_key_id: string
          created_at: string
          endpoint: string
          id: string
          ip_address: unknown | null
          method: string
          request_data: Json | null
          response_data: Json | null
          status_code: number
          user_agent: string | null
        }
        Insert: {
          api_key_id: string
          created_at?: string
          endpoint: string
          id?: string
          ip_address?: unknown | null
          method: string
          request_data?: Json | null
          response_data?: Json | null
          status_code: number
          user_agent?: string | null
        }
        Update: {
          api_key_id?: string
          created_at?: string
          endpoint?: string
          id?: string
          ip_address?: unknown | null
          method?: string
          request_data?: Json | null
          response_data?: Json | null
          status_code?: number
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "api_usage_logs_api_key_id_fkey"
            columns: ["api_key_id"]
            isOneToOne: false
            referencedRelation: "api_keys"
            referencedColumns: ["id"]
          },
        ]
      }
      auto_coupon_rules: {
        Row: {
          coupon_description: string | null
          coupon_title: string
          created_at: string
          discount_type: Database["public"]["Enums"]["auto_coupon_discount_type"]
          discount_value: number
          id: string
          is_active: boolean
          max_coupons_per_day: number | null
          max_coupons_per_week: number | null
          min_purchase_amount: number | null
          min_spend_requirement: number | null
          rule_name: string
          send_email: boolean
          send_sms: boolean
          store_id: string
          trigger_type: Database["public"]["Enums"]["auto_coupon_trigger"]
          updated_at: string
          validity_days: number
        }
        Insert: {
          coupon_description?: string | null
          coupon_title: string
          created_at?: string
          discount_type: Database["public"]["Enums"]["auto_coupon_discount_type"]
          discount_value: number
          id?: string
          is_active?: boolean
          max_coupons_per_day?: number | null
          max_coupons_per_week?: number | null
          min_purchase_amount?: number | null
          min_spend_requirement?: number | null
          rule_name: string
          send_email?: boolean
          send_sms?: boolean
          store_id: string
          trigger_type: Database["public"]["Enums"]["auto_coupon_trigger"]
          updated_at?: string
          validity_days?: number
        }
        Update: {
          coupon_description?: string | null
          coupon_title?: string
          created_at?: string
          discount_type?: Database["public"]["Enums"]["auto_coupon_discount_type"]
          discount_value?: number
          id?: string
          is_active?: boolean
          max_coupons_per_day?: number | null
          max_coupons_per_week?: number | null
          min_purchase_amount?: number | null
          min_spend_requirement?: number | null
          rule_name?: string
          send_email?: boolean
          send_sms?: boolean
          store_id?: string
          trigger_type?: Database["public"]["Enums"]["auto_coupon_trigger"]
          updated_at?: string
          validity_days?: number
        }
        Relationships: [
          {
            foreignKeyName: "auto_coupon_rules_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      auto_generated_coupons: {
        Row: {
          coupon_id: string
          created_at: string
          customer_id: string
          email_sent: boolean | null
          email_sent_at: string | null
          id: string
          pos_transaction_id: string | null
          rule_id: string
          sms_sent: boolean | null
          sms_sent_at: string | null
          store_id: string
        }
        Insert: {
          coupon_id: string
          created_at?: string
          customer_id: string
          email_sent?: boolean | null
          email_sent_at?: string | null
          id?: string
          pos_transaction_id?: string | null
          rule_id: string
          sms_sent?: boolean | null
          sms_sent_at?: string | null
          store_id: string
        }
        Update: {
          coupon_id?: string
          created_at?: string
          customer_id?: string
          email_sent?: boolean | null
          email_sent_at?: string | null
          id?: string
          pos_transaction_id?: string | null
          rule_id?: string
          sms_sent?: boolean | null
          sms_sent_at?: string | null
          store_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "auto_generated_coupons_coupon_id_fkey"
            columns: ["coupon_id"]
            isOneToOne: false
            referencedRelation: "coupons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "auto_generated_coupons_pos_transaction_id_fkey"
            columns: ["pos_transaction_id"]
            isOneToOne: false
            referencedRelation: "pos_transactions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "auto_generated_coupons_rule_id_fkey"
            columns: ["rule_id"]
            isOneToOne: false
            referencedRelation: "auto_coupon_rules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "auto_generated_coupons_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      coupon_redemptions: {
        Row: {
          admin_id: string
          coupon_id: string
          created_at: string
          customer_id: string
          id: string
          notes: string | null
          redeemed_at: string
          redemption_amount: number | null
          store_id: string
        }
        Insert: {
          admin_id: string
          coupon_id: string
          created_at?: string
          customer_id: string
          id?: string
          notes?: string | null
          redeemed_at?: string
          redemption_amount?: number | null
          store_id: string
        }
        Update: {
          admin_id?: string
          coupon_id?: string
          created_at?: string
          customer_id?: string
          id?: string
          notes?: string | null
          redeemed_at?: string
          redemption_amount?: number | null
          store_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "coupon_redemptions_coupon_id_fkey"
            columns: ["coupon_id"]
            isOneToOne: false
            referencedRelation: "coupons"
            referencedColumns: ["id"]
          },
        ]
      }
      coupons: {
        Row: {
          category: string | null
          coupon_code: string
          created_at: string
          customer_id: string | null
          description: string | null
          discount_value: string
          expires_at: string
          id: string
          min_spend: number | null
          receipt_id: string | null
          status: Database["public"]["Enums"]["coupon_status"]
          store_id: string | null
          text_color: string | null
          theme_image_url: string | null
          title: string
          type: Database["public"]["Enums"]["coupon_type"]
          used_at: string | null
        }
        Insert: {
          category?: string | null
          coupon_code: string
          created_at?: string
          customer_id?: string | null
          description?: string | null
          discount_value: string
          expires_at: string
          id?: string
          min_spend?: number | null
          receipt_id?: string | null
          status?: Database["public"]["Enums"]["coupon_status"]
          store_id?: string | null
          text_color?: string | null
          theme_image_url?: string | null
          title: string
          type: Database["public"]["Enums"]["coupon_type"]
          used_at?: string | null
        }
        Update: {
          category?: string | null
          coupon_code?: string
          created_at?: string
          customer_id?: string | null
          description?: string | null
          discount_value?: string
          expires_at?: string
          id?: string
          min_spend?: number | null
          receipt_id?: string | null
          status?: Database["public"]["Enums"]["coupon_status"]
          store_id?: string | null
          text_color?: string | null
          theme_image_url?: string | null
          title?: string
          type?: Database["public"]["Enums"]["coupon_type"]
          used_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "coupons_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coupons_receipt_id_fkey"
            columns: ["receipt_id"]
            isOneToOne: false
            referencedRelation: "receipts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coupons_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_coupons_store_id"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_loyalty: {
        Row: {
          created_at: string
          current_points: number
          current_tier: Database["public"]["Enums"]["tier_level"]
          customer_id: string
          id: string
          store_id: string | null
          tier_updated_at: string
          total_points_earned: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          current_points?: number
          current_tier?: Database["public"]["Enums"]["tier_level"]
          customer_id: string
          id?: string
          store_id?: string | null
          tier_updated_at?: string
          total_points_earned?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          current_points?: number
          current_tier?: Database["public"]["Enums"]["tier_level"]
          customer_id?: string
          id?: string
          store_id?: string | null
          tier_updated_at?: string
          total_points_earned?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "customer_loyalty_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_loyalty_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_customer_loyalty_store_id"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_notification_preferences: {
        Row: {
          created_at: string
          customer_id: string
          id: string
          receive_email_coupons: boolean
          receive_sms_coupons: boolean
          store_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          customer_id: string
          id?: string
          receive_email_coupons?: boolean
          receive_sms_coupons?: boolean
          store_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          customer_id?: string
          id?: string
          receive_email_coupons?: boolean
          receive_sms_coupons?: boolean
          store_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "customer_notification_preferences_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_notifications: {
        Row: {
          created_at: string
          customer_id: string
          id: string
          message: string
          read: boolean
          store_id: string | null
          title: string
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          customer_id: string
          id?: string
          message: string
          read?: boolean
          store_id?: string | null
          title: string
          type?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          customer_id?: string
          id?: string
          message?: string
          read?: boolean
          store_id?: string | null
          title?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "customer_notifications_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_notifications_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_store_enrollments: {
        Row: {
          block_reason: string | null
          blocked_at: string | null
          blocked_by: string | null
          customer_id: string | null
          enrolled_at: string
          id: string
          status: string
          store_id: string | null
          unenrolled_at: string | null
        }
        Insert: {
          block_reason?: string | null
          blocked_at?: string | null
          blocked_by?: string | null
          customer_id?: string | null
          enrolled_at?: string
          id?: string
          status?: string
          store_id?: string | null
          unenrolled_at?: string | null
        }
        Update: {
          block_reason?: string | null
          blocked_at?: string | null
          blocked_by?: string | null
          customer_id?: string | null
          enrolled_at?: string
          id?: string
          status?: string
          store_id?: string | null
          unenrolled_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customer_store_enrollments_blocked_by_fkey"
            columns: ["blocked_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_store_enrollments_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_store_enrollments_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      loyalty_tiers: {
        Row: {
          benefits: Json
          id: string
          max_points: number | null
          min_points: number
          name: Database["public"]["Enums"]["tier_level"]
          points_multiplier: number
        }
        Insert: {
          benefits?: Json
          id?: string
          max_points?: number | null
          min_points: number
          name: Database["public"]["Enums"]["tier_level"]
          points_multiplier?: number
        }
        Update: {
          benefits?: Json
          id?: string
          max_points?: number | null
          min_points?: number
          name?: Database["public"]["Enums"]["tier_level"]
          points_multiplier?: number
        }
        Relationships: []
      }
      points_transactions: {
        Row: {
          coupon_id: string | null
          created_at: string
          customer_id: string
          description: string
          id: string
          points: number
          receipt_id: string | null
          store_id: string | null
          transaction_type: string
        }
        Insert: {
          coupon_id?: string | null
          created_at?: string
          customer_id: string
          description: string
          id?: string
          points: number
          receipt_id?: string | null
          store_id?: string | null
          transaction_type: string
        }
        Update: {
          coupon_id?: string | null
          created_at?: string
          customer_id?: string
          description?: string
          id?: string
          points?: number
          receipt_id?: string | null
          store_id?: string | null
          transaction_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "points_transactions_coupon_id_fkey"
            columns: ["coupon_id"]
            isOneToOne: false
            referencedRelation: "coupons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "points_transactions_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "points_transactions_receipt_id_fkey"
            columns: ["receipt_id"]
            isOneToOne: false
            referencedRelation: "receipts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "points_transactions_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      pos_configurations: {
        Row: {
          api_credentials: Json | null
          created_at: string
          field_mapping: Json
          id: string
          integration_type: string
          is_active: boolean
          last_sync_at: string | null
          point_calculation_rules: Json
          polling_interval_minutes: number | null
          pos_provider: string
          store_id: string
          updated_at: string
          webhook_secret: string | null
          webhook_url: string | null
        }
        Insert: {
          api_credentials?: Json | null
          created_at?: string
          field_mapping?: Json
          id?: string
          integration_type?: string
          is_active?: boolean
          last_sync_at?: string | null
          point_calculation_rules?: Json
          polling_interval_minutes?: number | null
          pos_provider: string
          store_id: string
          updated_at?: string
          webhook_secret?: string | null
          webhook_url?: string | null
        }
        Update: {
          api_credentials?: Json | null
          created_at?: string
          field_mapping?: Json
          id?: string
          integration_type?: string
          is_active?: boolean
          last_sync_at?: string | null
          point_calculation_rules?: Json
          polling_interval_minutes?: number | null
          pos_provider?: string
          store_id?: string
          updated_at?: string
          webhook_secret?: string | null
          webhook_url?: string | null
        }
        Relationships: []
      }
      pos_transactions: {
        Row: {
          created_at: string
          customer_id: string | null
          error_message: string | null
          id: string
          points_awarded: number | null
          pos_customer_id: string | null
          pos_provider: string
          pos_transaction_id: string
          processed_at: string | null
          processing_status: string
          receipt_id: string | null
          store_id: string
          transaction_data: Json
          updated_at: string
        }
        Insert: {
          created_at?: string
          customer_id?: string | null
          error_message?: string | null
          id?: string
          points_awarded?: number | null
          pos_customer_id?: string | null
          pos_provider: string
          pos_transaction_id: string
          processed_at?: string | null
          processing_status?: string
          receipt_id?: string | null
          store_id: string
          transaction_data: Json
          updated_at?: string
        }
        Update: {
          created_at?: string
          customer_id?: string | null
          error_message?: string | null
          id?: string
          points_awarded?: number | null
          pos_customer_id?: string | null
          pos_provider?: string
          pos_transaction_id?: string
          processed_at?: string | null
          processing_status?: string
          receipt_id?: string | null
          store_id?: string
          transaction_data?: Json
          updated_at?: string
        }
        Relationships: []
      }
      product_categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          store_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          store_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          store_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_categories_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category: string
          created_at: string
          id: string
          in_promotions: boolean
          name: string
          points_earned: number
          price: number
          sku: string
          status: string
          stock: number
          store_id: string
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          id?: string
          in_promotions?: boolean
          name: string
          points_earned?: number
          price: number
          sku: string
          status?: string
          stock?: number
          store_id: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          in_promotions?: boolean
          name?: string
          points_earned?: number
          price?: number
          sku?: string
          status?: string
          stock?: number
          store_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address: string | null
          admin_tour_completed: boolean | null
          avatar_url: string | null
          city: string | null
          created_at: string
          customer_tour_completed: boolean | null
          date_of_birth: string | null
          email: string
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          preferences: Json | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
          zip_code: string | null
        }
        Insert: {
          address?: string | null
          admin_tour_completed?: boolean | null
          avatar_url?: string | null
          city?: string | null
          created_at?: string
          customer_tour_completed?: boolean | null
          date_of_birth?: string | null
          email: string
          first_name?: string | null
          id: string
          last_name?: string | null
          phone?: string | null
          preferences?: Json | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          zip_code?: string | null
        }
        Update: {
          address?: string | null
          admin_tour_completed?: boolean | null
          avatar_url?: string | null
          city?: string | null
          created_at?: string
          customer_tour_completed?: boolean | null
          date_of_birth?: string | null
          email?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          preferences?: Json | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          zip_code?: string | null
        }
        Relationships: []
      }
      receipts: {
        Row: {
          customer_id: string
          id: string
          image_url: string | null
          notes: string | null
          points_awarded: number | null
          pos_transaction_id: string | null
          processed_at: string | null
          processed_by: string | null
          receipt_number: string
          source_type: string
          status: Database["public"]["Enums"]["receipt_status"]
          store_id: string | null
          submitted_at: string
          total_amount: number
        }
        Insert: {
          customer_id: string
          id?: string
          image_url?: string | null
          notes?: string | null
          points_awarded?: number | null
          pos_transaction_id?: string | null
          processed_at?: string | null
          processed_by?: string | null
          receipt_number: string
          source_type?: string
          status?: Database["public"]["Enums"]["receipt_status"]
          store_id?: string | null
          submitted_at?: string
          total_amount: number
        }
        Update: {
          customer_id?: string
          id?: string
          image_url?: string | null
          notes?: string | null
          points_awarded?: number | null
          pos_transaction_id?: string | null
          processed_at?: string | null
          processed_by?: string | null
          receipt_number?: string
          source_type?: string
          status?: Database["public"]["Enums"]["receipt_status"]
          store_id?: string | null
          submitted_at?: string
          total_amount?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_receipts_store_id"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "receipts_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "receipts_pos_transaction_id_fkey"
            columns: ["pos_transaction_id"]
            isOneToOne: false
            referencedRelation: "pos_transactions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "receipts_processed_by_fkey"
            columns: ["processed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "receipts_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      stores: {
        Row: {
          address: string | null
          created_at: string
          id: string
          name: string
          phone: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string
          id?: string
          name: string
          phone?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string
          id?: string
          name?: string
          phone?: string | null
        }
        Relationships: []
      }
      transaction_items: {
        Row: {
          category: string | null
          created_at: string
          id: string
          item_data: Json | null
          item_name: string
          points_earned: number | null
          pos_item_id: string | null
          pos_transaction_id: string
          quantity: number
          total_price: number
          unit_price: number
        }
        Insert: {
          category?: string | null
          created_at?: string
          id?: string
          item_data?: Json | null
          item_name: string
          points_earned?: number | null
          pos_item_id?: string | null
          pos_transaction_id: string
          quantity?: number
          total_price: number
          unit_price: number
        }
        Update: {
          category?: string | null
          created_at?: string
          id?: string
          item_data?: Json | null
          item_name?: string
          points_earned?: number | null
          pos_item_id?: string | null
          pos_transaction_id?: string
          quantity?: number
          total_price?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "transaction_items_pos_transaction_id_fkey"
            columns: ["pos_transaction_id"]
            isOneToOne: false
            referencedRelation: "pos_transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      user_tours: {
        Row: {
          completed_at: string
          created_at: string
          id: string
          tour_type: string
          user_id: string
        }
        Insert: {
          completed_at?: string
          created_at?: string
          id?: string
          tour_type: string
          user_id: string
        }
        Update: {
          completed_at?: string
          created_at?: string
          id?: string
          tour_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_tours_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: { user_id: string }
        Returns: Database["public"]["Enums"]["user_role"]
      }
      is_admin: {
        Args: { user_id: string }
        Returns: boolean
      }
      is_store_admin: {
        Args: { user_id: string; store_id: string }
        Returns: boolean
      }
      process_pos_transaction: {
        Args: { transaction_id: string }
        Returns: {
          success: boolean
          points_awarded: number
          error_message: string
        }[]
      }
      update_customer_tier: {
        Args: { customer_uuid: string }
        Returns: undefined
      }
      validate_api_key: {
        Args: { key_value: string }
        Returns: {
          admin_id: string
          permissions: Json
          is_valid: boolean
        }[]
      }
    }
    Enums: {
      auto_coupon_discount_type: "fixed_amount" | "percentage" | "free_shipping"
      auto_coupon_trigger:
        | "every_purchase"
        | "daily_limit"
        | "weekly_limit"
        | "spending_threshold"
      coupon_status: "active" | "used" | "expired"
      coupon_type: "percentage" | "fixed" | "freebie"
      receipt_status: "pending" | "approved" | "rejected"
      tier_level: "Bronze" | "Silver" | "Gold" | "Platinum"
      user_role: "customer" | "admin"
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
      auto_coupon_discount_type: [
        "fixed_amount",
        "percentage",
        "free_shipping",
      ],
      auto_coupon_trigger: [
        "every_purchase",
        "daily_limit",
        "weekly_limit",
        "spending_threshold",
      ],
      coupon_status: ["active", "used", "expired"],
      coupon_type: ["percentage", "fixed", "freebie"],
      receipt_status: ["pending", "approved", "rejected"],
      tier_level: ["Bronze", "Silver", "Gold", "Platinum"],
      user_role: ["customer", "admin"],
    },
  },
} as const
