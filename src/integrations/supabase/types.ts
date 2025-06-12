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
      faturas_emitidas: {
        Row: {
          created_at: string
          data_emissao: string
          data_vencimento: string | null
          documento: string
          fatura_url: string
          id: string
          numero_fatura: string | null
          referencia: string | null
          status_pagamento: string
          subscriber_id: string | null
          tipo_pessoa: string
          uc: string
          updated_at: string
          user_id: string
          valor_total: number | null
        }
        Insert: {
          created_at?: string
          data_emissao?: string
          data_vencimento?: string | null
          documento: string
          fatura_url: string
          id?: string
          numero_fatura?: string | null
          referencia?: string | null
          status_pagamento?: string
          subscriber_id?: string | null
          tipo_pessoa: string
          uc: string
          updated_at?: string
          user_id: string
          valor_total?: number | null
        }
        Update: {
          created_at?: string
          data_emissao?: string
          data_vencimento?: string | null
          documento?: string
          fatura_url?: string
          id?: string
          numero_fatura?: string | null
          referencia?: string | null
          status_pagamento?: string
          subscriber_id?: string | null
          tipo_pessoa?: string
          uc?: string
          updated_at?: string
          user_id?: string
          valor_total?: number | null
        }
        Relationships: []
      }
      faturas_validacao: {
        Row: {
          created_at: string
          data_nascimento: string | null
          documento: string
          fatura_url: string
          id: string
          message: string | null
          pdf_path: string | null
          status: string
          subscriber_id: string | null
          tipo_pessoa: string
          uc: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          data_nascimento?: string | null
          documento: string
          fatura_url: string
          id?: string
          message?: string | null
          pdf_path?: string | null
          status?: string
          subscriber_id?: string | null
          tipo_pessoa: string
          uc: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          data_nascimento?: string | null
          documento?: string
          fatura_url?: string
          id?: string
          message?: string | null
          pdf_path?: string | null
          status?: string
          subscriber_id?: string | null
          tipo_pessoa?: string
          uc?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "faturas_validacao_subscriber_id_fkey"
            columns: ["subscriber_id"]
            isOneToOne: false
            referencedRelation: "subscribers"
            referencedColumns: ["id"]
          },
        ]
      }
      generators: {
        Row: {
          administrator: Json | null
          attachments: Json | null
          concessionaria: string
          created_at: string
          distributor_login: Json
          id: string
          owner: Json
          payment_data: Json
          plants: Json
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          administrator?: Json | null
          attachments?: Json | null
          concessionaria: string
          created_at?: string
          distributor_login: Json
          id?: string
          owner: Json
          payment_data: Json
          plants: Json
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          administrator?: Json | null
          attachments?: Json | null
          concessionaria?: string
          created_at?: string
          distributor_login?: Json
          id?: string
          owner?: Json
          payment_data?: Json
          plants?: Json
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      representatives: {
        Row: {
          commission_rate: number
          created_at: string
          email: string
          id: string
          name: string
          phone: string
          region: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          commission_rate?: number
          created_at?: string
          email: string
          id?: string
          name: string
          phone: string
          region: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          commission_rate?: number
          created_at?: string
          email?: string
          id?: string
          name?: string
          phone?: string
          region?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      solar_access_logs: {
        Row: {
          action: string
          created_at: string | null
          id: string
          ip_address: unknown | null
          resource_id: string | null
          resource_type: string | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          resource_id?: string | null
          resource_type?: string | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          resource_id?: string | null
          resource_type?: string | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      solar_password_history: {
        Row: {
          change_reason: string | null
          changed_at: string
          id: string
          old_password_encrypted: string
          password_id: string
          user_id: string | null
          version_number: number | null
        }
        Insert: {
          change_reason?: string | null
          changed_at?: string
          id?: string
          old_password_encrypted: string
          password_id: string
          user_id?: string | null
          version_number?: number | null
        }
        Update: {
          change_reason?: string | null
          changed_at?: string
          id?: string
          old_password_encrypted?: string
          password_id?: string
          user_id?: string | null
          version_number?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "solar_password_history_password_id_fkey"
            columns: ["password_id"]
            isOneToOne: false
            referencedRelation: "solar_passwords"
            referencedColumns: ["id"]
          },
        ]
      }
      solar_passwords: {
        Row: {
          category: Database["public"]["Enums"]["password_category"] | null
          created_at: string
          email: string | null
          id: string
          is_favorite: boolean | null
          last_used: string | null
          notes: string | null
          password_encrypted: string
          title: string
          updated_at: string
          user_id: string
          username: string | null
          version: number | null
          website_url: string | null
        }
        Insert: {
          category?: Database["public"]["Enums"]["password_category"] | null
          created_at?: string
          email?: string | null
          id?: string
          is_favorite?: boolean | null
          last_used?: string | null
          notes?: string | null
          password_encrypted: string
          title: string
          updated_at?: string
          user_id: string
          username?: string | null
          version?: number | null
          website_url?: string | null
        }
        Update: {
          category?: Database["public"]["Enums"]["password_category"] | null
          created_at?: string
          email?: string | null
          id?: string
          is_favorite?: boolean | null
          last_used?: string | null
          notes?: string | null
          password_encrypted?: string
          title?: string
          updated_at?: string
          user_id?: string
          username?: string | null
          version?: number | null
          website_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "solar_passwords_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "solar_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      solar_profiles: {
        Row: {
          created_at: string
          data_processing_consent: boolean | null
          data_processing_consent_at: string | null
          email: string | null
          full_name: string | null
          id: string
          privacy_policy_accepted: boolean | null
          privacy_policy_accepted_at: string | null
          privacy_policy_version: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          data_processing_consent?: boolean | null
          data_processing_consent_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          privacy_policy_accepted?: boolean | null
          privacy_policy_accepted_at?: string | null
          privacy_policy_version?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          data_processing_consent?: boolean | null
          data_processing_consent_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          privacy_policy_accepted?: boolean | null
          privacy_policy_accepted_at?: string | null
          privacy_policy_version?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      subscribers: {
        Row: {
          administrator: Json | null
          attachments: Json | null
          concessionaria: string | null
          created_at: string
          energy_account: Json | null
          id: string
          notifications: Json | null
          plan_contract: Json | null
          plan_details: Json | null
          status: string | null
          subscriber: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          administrator?: Json | null
          attachments?: Json | null
          concessionaria?: string | null
          created_at?: string
          energy_account?: Json | null
          id?: string
          notifications?: Json | null
          plan_contract?: Json | null
          plan_details?: Json | null
          status?: string | null
          subscriber?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          administrator?: Json | null
          attachments?: Json | null
          concessionaria?: string | null
          created_at?: string
          energy_account?: Json | null
          id?: string
          notifications?: Json | null
          plan_contract?: Json | null
          plan_details?: Json | null
          status?: string | null
          subscriber?: Json | null
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
      [_ in never]: never
    }
    Enums: {
      password_category:
        | "email"
        | "social_media"
        | "work"
        | "banking"
        | "shopping"
        | "entertainment"
        | "development"
        | "other"
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
      password_category: [
        "email",
        "social_media",
        "work",
        "banking",
        "shopping",
        "entertainment",
        "development",
        "other",
      ],
    },
  },
} as const
