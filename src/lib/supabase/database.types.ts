export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      assessment_answers: {
        Row: {
          answered_at: string
          question_idx: number
          user_id: string
          value: number | null
        }
        Insert: {
          answered_at?: string
          question_idx: number
          user_id: string
          value?: number | null
        }
        Update: {
          answered_at?: string
          question_idx?: number
          user_id?: string
          value?: number | null
        }
        Relationships: []
      }
      assessment_questions: {
        Row: {
          idx: number
          skill: string
          text_i18n: Json
        }
        Insert: {
          idx: number
          skill: string
          text_i18n: Json
        }
        Update: {
          idx?: number
          skill?: string
          text_i18n?: Json
        }
        Relationships: []
      }
      engagement_events: {
        Row: {
          created_at: string
          duration_ms: number | null
          id: number
          kind: string
          meta: Json | null
          module_id: string | null
          screen_idx: number | null
          user_id: string
        }
        Insert: {
          created_at?: string
          duration_ms?: number | null
          id?: never
          kind: string
          meta?: Json | null
          module_id?: string | null
          screen_idx?: number | null
          user_id: string
        }
        Update: {
          created_at?: string
          duration_ms?: number | null
          id?: never
          kind?: string
          meta?: Json | null
          module_id?: string | null
          screen_idx?: number | null
          user_id?: string
        }
        Relationships: []
      }
      locked_clusters: {
        Row: {
          id: number
          name: string
          sort_order: number
        }
        Insert: {
          id?: number
          name: string
          sort_order?: number
        }
        Update: {
          id?: number
          name?: string
          sort_order?: number
        }
        Relationships: []
      }
      module_progress: {
        Row: {
          completed_at: string | null
          module_id: string
          quiz_correct: number
          quiz_total: number
          reflection: string | null
          score_pct: number
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          module_id: string
          quiz_correct?: number
          quiz_total?: number
          reflection?: string | null
          score_pct?: number
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          module_id?: string
          quiz_correct?: number
          quiz_total?: number
          reflection?: string | null
          score_pct?: number
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      modules: {
        Row: {
          cluster: string
          created_at: string
          id: string
          minutes: number
          screens: Json
          skill: string
          sort_order: number
          summary: string
          title: string
        }
        Insert: {
          cluster: string
          created_at?: string
          id: string
          minutes?: number
          screens?: Json
          skill: string
          sort_order?: number
          summary: string
          title: string
        }
        Update: {
          cluster?: string
          created_at?: string
          id?: string
          minutes?: number
          screens?: Json
          skill?: string
          sort_order?: number
          summary?: string
          title?: string
        }
        Relationships: []
      }
      onboarding_answers: {
        Row: {
          answer_idx: number | null
          answered_at: string
          question_idx: number
          user_id: string
        }
        Insert: {
          answer_idx?: number | null
          answered_at?: string
          question_idx: number
          user_id: string
        }
        Update: {
          answer_idx?: number | null
          answered_at?: string
          question_idx?: number
          user_id?: string
        }
        Relationships: []
      }
      onboarding_questions: {
        Row: {
          idx: number
          options_i18n: Json
          text_i18n: Json
        }
        Insert: {
          idx: number
          options_i18n: Json
          text_i18n: Json
        }
        Update: {
          idx?: number
          options_i18n?: Json
          text_i18n?: Json
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          email: string | null
          id: string
          is_admin: boolean
          language: string
          onboarded: boolean
          role: string
          streak: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          email?: string | null
          id: string
          is_admin?: boolean
          language?: string
          onboarded?: boolean
          role?: string
          streak?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
          is_admin?: boolean
          language?: string
          onboarded?: boolean
          role?: string
          streak?: number
          updated_at?: string
        }
        Relationships: []
      }
      question_attempts: {
        Row: {
          answered_at: string
          id: number
          is_correct: boolean | null
          kind: string
          module_id: string
          prompt: string | null
          response: string | null
          screen_idx: number
          user_id: string
        }
        Insert: {
          answered_at?: string
          id?: number
          is_correct?: boolean | null
          kind: string
          module_id: string
          prompt?: string | null
          response?: string | null
          screen_idx: number
          user_id: string
        }
        Update: {
          answered_at?: string
          id?: number
          is_correct?: boolean | null
          kind?: string
          module_id?: string
          prompt?: string | null
          response?: string | null
          screen_idx?: number
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
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
