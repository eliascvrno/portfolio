export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      chat_messages: {
        Row: {
          content: string
          created_at: string
          id: number
          role: string
          session_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: number
          role: string
          session_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: number
          role?: string
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "chat_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_sessions: {
        Row: {
          created_at: string
          id: string
          visitor_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          visitor_id: string
        }
        Update: {
          created_at?: string
          id?: string
          visitor_id?: string
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          read: boolean
          replied: boolean
          subject: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          read?: boolean
          replied?: boolean
          subject?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          read?: boolean
          replied?: boolean
          subject?: string | null
        }
        Relationships: []
      }
      education: {
        Row: {
          created_at: string
          degree_en: string
          degree_es: string
          description_en: string | null
          description_es: string | null
          display_order: number
          end_date: string | null
          id: string
          institution: string
          logo_url: string | null
          start_date: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          degree_en: string
          degree_es: string
          description_en?: string | null
          description_es?: string | null
          display_order?: number
          end_date?: string | null
          id?: string
          institution: string
          logo_url?: string | null
          start_date: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          degree_en?: string
          degree_es?: string
          description_en?: string | null
          description_es?: string | null
          display_order?: number
          end_date?: string | null
          id?: string
          institution?: string
          logo_url?: string | null
          start_date?: string
          updated_at?: string
        }
        Relationships: []
      }
      experiences: {
        Row: {
          company: string
          created_at: string
          description_en: string
          description_es: string
          display_order: number
          end_date: string | null
          id: string
          location: string | null
          logo_url: string | null
          role_en: string
          role_es: string
          start_date: string
          updated_at: string
        }
        Insert: {
          company: string
          created_at?: string
          description_en?: string
          description_es?: string
          display_order?: number
          end_date?: string | null
          id?: string
          location?: string | null
          logo_url?: string | null
          role_en: string
          role_es: string
          start_date: string
          updated_at?: string
        }
        Update: {
          company?: string
          created_at?: string
          description_en?: string
          description_es?: string
          display_order?: number
          end_date?: string | null
          id?: string
          location?: string | null
          logo_url?: string | null
          role_en?: string
          role_es?: string
          start_date?: string
          updated_at?: string
        }
        Relationships: []
      }
      page_views: {
        Row: {
          created_at: string
          id: number
          path: string
          referrer: string | null
          user_agent: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          path: string
          referrer?: string | null
          user_agent?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          path?: string
          referrer?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          available: boolean
          avatar_url: string | null
          bio_en: string
          bio_es: string
          created_at: string
          cv_url: string | null
          email: string | null
          featured_technologies: string[]
          github_url: string | null
          id: string
          is_primary: boolean
          linkedin_url: string | null
          location: string | null
          name: string
          phone: string | null
          projects_count: number
          technologies_count: number
          title_en: string
          title_es: string
          updated_at: string
          years_experience: number
        }
        Insert: {
          available?: boolean
          avatar_url?: string | null
          bio_en?: string
          bio_es?: string
          created_at?: string
          cv_url?: string | null
          email?: string | null
          featured_technologies?: string[]
          github_url?: string | null
          id?: string
          is_primary?: boolean
          linkedin_url?: string | null
          location?: string | null
          name?: string
          phone?: string | null
          projects_count?: number
          technologies_count?: number
          title_en?: string
          title_es?: string
          updated_at?: string
          years_experience?: number
        }
        Update: {
          available?: boolean
          avatar_url?: string | null
          bio_en?: string
          bio_es?: string
          created_at?: string
          cv_url?: string | null
          email?: string | null
          featured_technologies?: string[]
          github_url?: string | null
          id?: string
          is_primary?: boolean
          linkedin_url?: string | null
          location?: string | null
          name?: string
          phone?: string | null
          projects_count?: number
          technologies_count?: number
          title_en?: string
          title_es?: string
          updated_at?: string
          years_experience?: number
        }
        Relationships: []
      }
      projects: {
        Row: {
          category: string
          cover_url: string | null
          created_at: string
          demo_url: string | null
          description_en: string
          description_es: string
          display_order: number
          featured: boolean
          gallery: Json
          has_readme: boolean
          id: string
          long_description_en: string | null
          long_description_es: string | null
          readme_en: string | null
          readme_es: string | null
          repo_url: string | null
          slug: string
          stack: Json
          title: string
          updated_at: string
          video_url: string | null
        }
        Insert: {
          category?: string
          cover_url?: string | null
          created_at?: string
          demo_url?: string | null
          description_en?: string
          description_es?: string
          display_order?: number
          featured?: boolean
          gallery?: Json
          has_readme?: boolean
          id?: string
          long_description_en?: string | null
          long_description_es?: string | null
          readme_en?: string | null
          readme_es?: string | null
          repo_url?: string | null
          slug: string
          stack?: Json
          title: string
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          category?: string
          cover_url?: string | null
          created_at?: string
          demo_url?: string | null
          description_en?: string
          description_es?: string
          display_order?: number
          featured?: boolean
          gallery?: Json
          has_readme?: boolean
          id?: string
          long_description_en?: string | null
          long_description_es?: string | null
          readme_en?: string | null
          readme_es?: string | null
          repo_url?: string | null
          slug?: string
          stack?: Json
          title?: string
          updated_at?: string
          video_url?: string | null
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          key: string
          updated_at?: string
          value?: Json
        }
        Update: {
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      skills: {
        Row: {
          category: string
          created_at: string
          display_order: number
          icon: string | null
          id: string
          level: number
          name: string
          updated_at: string
        }
        Insert: {
          category?: string
          created_at?: string
          display_order?: number
          icon?: string | null
          id?: string
          level?: number
          name: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          display_order?: number
          icon?: string | null
          id?: string
          level?: number
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      technologies: {
        Row: {
          color: string | null
          created_at: string
          display_order: number
          icon_url: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          display_order?: number
          icon_url?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          color?: string | null
          created_at?: string
          display_order?: number
          icon_url?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
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
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
