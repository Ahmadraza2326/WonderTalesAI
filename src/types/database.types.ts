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
      child_profiles: {
        Row: {
          age: number | null
          avatar: string | null
          created_at: string | null
          favorite_theme: string | null
          id: string
          interests: string[] | null
          name: string
          parent_id: string | null
          preferred_language: string | null
          reading_level: string | null
          updated_at: string | null
          xp: number
          stars: number
          current_streak: number
          last_activity_date: string | null
        }
        Insert: {
          age?: number | null
          avatar?: string | null
          created_at?: string | null
          favorite_theme?: string | null
          id?: string
          interests?: string[] | null
          name: string
          parent_id?: string | null
          preferred_language?: string | null
          reading_level?: string | null
          updated_at?: string | null
          xp?: number
          stars?: number
          current_streak?: number
          last_activity_date?: string | null
        }
        Update: {
          age?: number | null
          avatar?: string | null
          created_at?: string | null
          favorite_theme?: string | null
          id?: string
          interests?: string[] | null
          name?: string
          parent_id?: string | null
          preferred_language?: string | null
          reading_level?: string | null
          updated_at?: string | null
          xp?: number
          stars?: number
          current_streak?: number
          last_activity_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "child_profiles_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      child_activity_rewards: {
        Row: {
          activity_id: string
          activity_type: string
          child_id: string
          created_at: string
          id: string
          stars_awarded: number
          xp_awarded: number
        }
        Insert: {
          activity_id: string
          activity_type: string
          child_id: string
          created_at?: string
          id?: string
          stars_awarded?: number
          xp_awarded?: number
        }
        Update: {
          activity_id?: string
          activity_type?: string
          child_id?: string
          created_at?: string
          id?: string
          stars_awarded?: number
          xp_awarded?: number
        }
        Relationships: [
          {
            foreignKeyName: "child_activity_rewards_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "child_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          full_name: string | null
          id: string
          role: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id: string
          role?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          role?: string | null
        }
        Relationships: []
      }
      stories: {
        Row: {
          characters: string | null
          child_age: number
          child_id?: string | null
          child_name: string
          created_at: string
          generated_at: string | null
          generation_status: string | null
          id: string
          is_favorite: boolean
          language: string
          learning_package: Json | null
          moral: string | null
          reading_level: string
          status: string
          story_content: string | null
          story_length: string
          theme: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          characters?: string | null
          child_age: number
          child_name: string
          child_id?: string | null
          created_at?: string
          generated_at?: string | null
          generation_status?: string | null
          id?: string
          is_favorite?: boolean
          language: string
          learning_package?: Json | null
          moral?: string | null
          reading_level: string
          status?: string
          story_content?: string | null
          story_length: string
          theme?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          characters?: string | null
          child_age?: number
          child_name?: string
          child_id?: string | null
          created_at?: string
          generated_at?: string | null
          generation_status?: string | null
          id?: string
          is_favorite?: boolean
          language?: string
          learning_package?: Json | null
          moral?: string | null
          reading_level?: string
          status?: string
          story_content?: string | null
          story_length?: string
          theme?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      story_reading_progress: {
        Row: {
          child_id: string | null
          completed: boolean
          completed_at: string | null
          created_at: string
          id: string
          listened_audio: boolean
          pages_read: number
          reading_time_seconds: number
          story_id: string
          total_pages: number
          updated_at: string
          user_id: string
        }
        Insert: {
          child_id?: string | null
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          id?: string
          listened_audio?: boolean
          pages_read?: number
          reading_time_seconds?: number
          story_id: string
          total_pages?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          child_id?: string | null
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          id?: string
          listened_audio?: boolean
          pages_read?: number
          reading_time_seconds?: number
          story_id?: string
          total_pages?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      story_translations: {
        Row: {
          created_at: string
          id: string
          story_id: string
          target_locale: string
          translated_content: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          story_id: string
          target_locale: string
          translated_content: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          story_id?: string
          target_locale?: string
          translated_content?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "story_translations_story_id_fkey"
            columns: ["story_id"]
            isOneToOne: false
            referencedRelation: "stories"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      award_child_rewards: {
        Args: {
          p_child_id: string
          p_activity_type: string
          p_activity_id: string
          p_xp_amount?: number
          p_stars_amount?: number
        }
        Returns: Json
      }
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
