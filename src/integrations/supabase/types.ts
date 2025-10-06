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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      "Extractor 2": {
        Row: {
          Autores: string | null
          LinkReferences1: string | null
          LinksReferences2: string | null
          References: string | null
          Resumen: string | null
          Titulo: string | null
        }
        Insert: {
          Autores?: string | null
          LinkReferences1?: string | null
          LinksReferences2?: string | null
          References?: string | null
          Resumen?: string | null
          Titulo?: string | null
        }
        Update: {
          Autores?: string | null
          LinkReferences1?: string | null
          LinksReferences2?: string | null
          References?: string | null
          Resumen?: string | null
          Titulo?: string | null
        }
        Relationships: []
      }
      OpeDataScienceExtraction: {
        Row: {
          AssayTypes: string | null
          Descripcion: string | null
          Description: string | null
          resumen_sintetizado: string | null
          Highlights: string | null
          Organismos: string | null
          Parameter_Value_Hardware: string | null
          Publications: string | null
          ReleaseDate: string | null
          Text: string | null
          textcenter: string | null
          Title: string | null
          Title_URL: string | null
        }
        Insert: {
          AssayTypes?: string | null
          Descripcion?: string | null
          Description?: string | null
          resumen_sintetizado?: string | null
          Highlights?: string | null
          Organismos?: string | null
          Parameter_Value_Hardware?: string | null
          Publications?: string | null
          ReleaseDate?: string | null
          Text?: string | null
          textcenter?: string | null
          Title?: string | null
          Title_URL?: string | null
        }
        Update: {
          AssayTypes?: string | null
          Descripcion?: string | null
          Description?: string | null
          resumen_sintetizado?: string | null
          Highlights?: string | null
          Organismos?: string | null
          Parameter_Value_Hardware?: string | null
          Publications?: string | null
          ReleaseDate?: string | null
          Text?: string | null
          textcenter?: string | null
          Title?: string | null
          Title_URL?: string | null
        }
        Relationships: []
      }
      sergiobarajas: {
        Row: {
          Autores: string | null
          autores_procesados: string[] | null
          Page_URL: string | null
          Resumen: string | null
          resumen_sintetizado: string | null
          Titulo: string | null
        }
        Insert: {
          Autores?: string | null
          autores_procesados?: string[] | null
          Page_URL?: string | null
          Resumen?: string | null
          resumen_sintetizado?: string | null
          Titulo?: string | null
        }
        Update: {
          Autores?: string | null
          autores_procesados?: string[] | null
          Page_URL?: string | null
          Resumen?: string | null
          resumen_sintetizado?: string | null
          Titulo?: string | null
        }
        Relationships: []
      }
      sergiobarajas2: {
        Row: {
          autores_originales: string | null
          autores_procesados: string[] | null
          created_at: string
          id: string
          page_url: string | null
          resumen_original: string | null
          resumen_sintetizado: string | null
          titulo: string | null
        }
        Insert: {
          autores_originales?: string | null
          autores_procesados?: string[] | null
          created_at?: string
          id?: string
          page_url?: string | null
          resumen_original?: string | null
          resumen_sintetizado?: string | null
          titulo?: string | null
        }
        Update: {
          autores_originales?: string | null
          autores_procesados?: string[] | null
          created_at?: string
          id?: string
          page_url?: string | null
          resumen_original?: string | null
          resumen_sintetizado?: string | null
          titulo?: string | null
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
