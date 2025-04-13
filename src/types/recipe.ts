export interface Ingredient {
  id: string
  recipe_id: string
  name: string
  amount: number
  unit: string
  created_at: string
  updated_at: string
}

export interface Instruction {
  id: string
  recipe_id: string
  step_number: number
  description: string
  created_at: string
  updated_at: string
}

export interface User {
  id: string
  username: string
  firstname?: string
  lastname?: string
}

export interface Recipe {
  id: string
  title: string
  description: string
  user_id: string
  user: User | null
  image_url?: string
  cooking_time?: number
  servings?: number
  handle: string
  ingredients: Array<{
    id: string
    name: string
    amount: number
    unit: string
  }>
  instructions: Array<{
    id: string
    step_number: number
    description: string
  }>
  created_at: string
  updated_at: string
} 