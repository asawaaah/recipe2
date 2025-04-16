export interface Recipe {
  id: string
  title: string
  description: string
  user_id: string
  handle: string
  image_url?: string
  cooking_time?: number
  servings?: number
  created_at?: string
  updated_at?: string
  ingredients?: Ingredient[]
  instructions?: Instruction[]
  tags?: string[]
  user?: User
}

export interface Ingredient {
  id: string
  recipe_id: string
  name: string
  amount: number
  unit: string
  created_at?: string
  updated_at?: string
}

export interface Instruction {
  id: string
  recipe_id: string
  step_number: number
  description: string
  created_at?: string
  updated_at?: string
}

export type RecipeTag = {
  recipe_id: string
  tag_id: string
  name?: string
}

export type RecipeFormStep = 'basics' | 'ingredients' | 'instructions' | 'image' | 'review'

export interface User {
  id: string
  email?: string
  username: string
  avatar_url?: string
  display_name?: string
  bio?: string
  created_at?: string
  updated_at?: string
} 