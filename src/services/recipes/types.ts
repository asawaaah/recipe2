export interface RecipeMetadata {
  title: string
  description: string
  image_url?: string
  cooking_time?: number
  servings?: number
  handle: string
}

export interface User {
  id: string
  username: string
  firstname?: string
  lastname?: string
}

export interface Recipe extends RecipeMetadata {
  id: string
  user_id: string
  user: User | null
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