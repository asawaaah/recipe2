import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://jnuakxuatxrajimebowt.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpudWFreHVhdHhyYWppbWVib3d0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ0MjQ5NTcsImV4cCI6MjA2MDAwMDk1N30.Px2C_QXGGRMoNSoB4J6D3cz1-BvkIIKtFgYqCqeVLjA'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          username: string
          avatar_url?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          username: string
          avatar_url?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          username?: string
          avatar_url?: string
          created_at?: string
          updated_at?: string
        }
      }
      recipes: {
        Row: {
          id: string
          title: string
          description: string
          user_id: string
          handle: string
          created_at: string
          updated_at: string
          image_url?: string
          cooking_time?: number
          servings?: number
        }
        Insert: {
          id?: string
          title: string
          description: string
          user_id: string
          handle?: string
          created_at?: string
          updated_at?: string
          image_url?: string
          cooking_time?: number
          servings?: number
        }
        Update: {
          id?: string
          title?: string
          description?: string
          user_id?: string
          handle?: string
          created_at?: string
          updated_at?: string
          image_url?: string
          cooking_time?: number
          servings?: number
        }
      }
      ingredients: {
        Row: {
          id: string
          recipe_id: string
          name: string
          amount: number
          unit: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          recipe_id: string
          name: string
          amount: number
          unit: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          recipe_id?: string
          name?: string
          amount?: number
          unit?: string
          created_at?: string
          updated_at?: string
        }
      }
      instructions: {
        Row: {
          id: string
          recipe_id: string
          step_number: number
          description: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          recipe_id: string
          step_number: number
          description: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          recipe_id?: string
          step_number?: number
          description?: string
          created_at?: string
          updated_at?: string
        }
      }
      tags: {
        Row: {
          id: string
          name: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          created_at?: string
          updated_at?: string
        }
      }
      recipe_tags: {
        Row: {
          recipe_id: string
          tag_id: string
          created_at: string
        }
        Insert: {
          recipe_id: string
          tag_id: string
          created_at?: string
        }
        Update: {
          recipe_id?: string
          tag_id?: string
          created_at?: string
        }
      }
      comments: {
        Row: {
          id: string
          recipe_id: string
          user_id: string
          content: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          recipe_id: string
          user_id: string
          content: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          recipe_id?: string
          user_id?: string
          content?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
