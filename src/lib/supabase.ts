import { createBrowserClient } from '@supabase/ssr'

export const createClient = () => {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

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
