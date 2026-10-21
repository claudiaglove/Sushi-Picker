// Generated from the live schema (Supabase `generate_typescript_types`). Regenerate after migrations.
export type Json =
  string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: '14.18'
  }
  public: {
    Tables: {
      saved_places: {
        Row: {
          note: string | null
          recommended_by: string | null
          spot_id: string
          status: string
          updated_at: string
          user_id: string
          verdict: string | null
        }
        Insert: {
          note?: string | null
          recommended_by?: string | null
          spot_id: string
          status: string
          updated_at?: string
          user_id?: string
          verdict?: string | null
        }
        Update: {
          note?: string | null
          recommended_by?: string | null
          spot_id?: string
          status?: string
          updated_at?: string
          user_id?: string
          verdict?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'saved_places_spot_id_fkey'
            columns: ['spot_id']
            isOneToOne: false
            referencedRelation: 'spots'
            referencedColumns: ['id']
          },
        ]
      }
      spots: {
        Row: {
          address: string
          city: string
          hours: string | null
          id: string
          lat: number
          lng: number
          maps_url: string
          name: string
          price_tier: string
          region: string
          style: string
        }
        Insert: {
          address: string
          city: string
          hours?: string | null
          id: string
          lat: number
          lng: number
          maps_url: string
          name: string
          price_tier: string
          region: string
          style: string
        }
        Update: {
          address?: string
          city?: string
          hours?: string | null
          id?: string
          lat?: number
          lng?: number
          maps_url?: string
          name?: string
          price_tier?: string
          region?: string
          style?: string
        }
        Relationships: []
      }
      user_settings: {
        Row: {
          lat: number
          lng: number
          updated_at: string
          user_id: string
          zip_code: string
        }
        Insert: {
          lat: number
          lng: number
          updated_at?: string
          user_id?: string
          zip_code: string
        }
        Update: {
          lat?: number
          lng?: number
          updated_at?: string
          user_id?: string
          zip_code?: string
        }
        Relationships: []
      }
    }
    Views: { [_ in never]: never }
    Functions: { [_ in never]: never }
    Enums: { [_ in never]: never }
    CompositeTypes: { [_ in never]: never }
  }
}
