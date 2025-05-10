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
      courses: {
        Row: {
          course_code: string
          course_name: string
          created_at: string | null
          credit_hours: number
          department: string
          id: string
          updated_at: string | null
        }
        Insert: {
          course_code: string
          course_name: string
          created_at?: string | null
          credit_hours: number
          department: string
          id?: string
          updated_at?: string | null
        }
        Update: {
          course_code?: string
          course_name?: string
          created_at?: string | null
          credit_hours?: number
          department?: string
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      grades: {
        Row: {
          course_id: string
          created_at: string | null
          grade_letter: string
          grade_points: number
          id: string
          percentage: number
          remarks: string | null
          student_id: string
          term_id: string
          updated_at: string | null
        }
        Insert: {
          course_id: string
          created_at?: string | null
          grade_letter: string
          grade_points: number
          id?: string
          percentage: number
          remarks?: string | null
          student_id: string
          term_id: string
          updated_at?: string | null
        }
        Update: {
          course_id?: string
          created_at?: string | null
          grade_letter?: string
          grade_points?: number
          id?: string
          percentage?: number
          remarks?: string | null
          student_id?: string
          term_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "grades_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "grades_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "grades_term_id_fkey"
            columns: ["term_id"]
            isOneToOne: false
            referencedRelation: "terms"
            referencedColumns: ["id"]
          },
        ]
      }
      student_terms: {
        Row: {
          created_at: string | null
          id: string
          student_id: string
          term_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          student_id: string
          term_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          student_id?: string
          term_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "student_terms_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_terms_term_id_fkey"
            columns: ["term_id"]
            isOneToOne: false
            referencedRelation: "terms"
            referencedColumns: ["id"]
          },
        ]
      }
      students: {
        Row: {
          created_at: string | null
          email: string
          enrollment_date: string
          first_name: string
          id: string
          last_name: string
          program: string
          student_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          enrollment_date: string
          first_name: string
          id?: string
          last_name: string
          program: string
          student_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          enrollment_date?: string
          first_name?: string
          id?: string
          last_name?: string
          program?: string
          student_id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      terms: {
        Row: {
          academic_year: string
          created_at: string | null
          end_date: string
          id: string
          semester_number: number | null
          start_date: string
          term_name: string
          updated_at: string | null
        }
        Insert: {
          academic_year: string
          created_at?: string | null
          end_date: string
          id?: string
          semester_number?: number | null
          start_date: string
          term_name: string
          updated_at?: string | null
        }
        Update: {
          academic_year?: string
          created_at?: string | null
          end_date?: string
          id?: string
          semester_number?: number | null
          start_date?: string
          term_name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      university_info: {
        Row: {
          address: string
          created_at: string | null
          email: string | null
          id: string
          logo_url: string | null
          name: string
          phone: string | null
          updated_at: string | null
          website: string | null
        }
        Insert: {
          address: string
          created_at?: string | null
          email?: string | null
          id?: string
          logo_url?: string | null
          name: string
          phone?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          address?: string
          created_at?: string | null
          email?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          phone?: string | null
          updated_at?: string | null
          website?: string | null
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
    Enums: {},
  },
} as const
