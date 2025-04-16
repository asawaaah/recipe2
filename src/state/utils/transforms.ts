/**
 * Transforms recipe data for the client
 */
export function transformRecipe(recipe: any) {
  if (!recipe) return null
  
  return {
    ...recipe,
    createdAt: recipe.created_at ? new Date(recipe.created_at) : null,
    updatedAt: recipe.updated_at ? new Date(recipe.updated_at) : null,
    cookingTime: recipe.cooking_time || null,
    imageUrl: recipe.image_url || null,
    userId: recipe.user_id || null,
  }
}

/**
 * Transforms recipe data for database storage
 */
export function transformRecipeForDb(recipe: any) {
  const dbRecipe = {
    ...recipe,
    created_at: recipe.createdAt ? recipe.createdAt.toISOString() : undefined,
    updated_at: recipe.updatedAt ? recipe.updatedAt.toISOString() : undefined,
    cooking_time: recipe.cookingTime || undefined,
    image_url: recipe.imageUrl || undefined,
    user_id: recipe.userId || undefined,
  }
  
  // Remove client-side properties
  delete dbRecipe.createdAt
  delete dbRecipe.updatedAt
  delete dbRecipe.cookingTime
  delete dbRecipe.imageUrl
  delete dbRecipe.userId
  
  return dbRecipe
}

/**
 * Transforms user data for the client
 */
export function transformUser(user: any) {
  if (!user) return null
  
  return {
    ...user,
    createdAt: user.created_at ? new Date(user.created_at) : null,
    updatedAt: user.updated_at ? new Date(user.updated_at) : null,
    displayName: user.display_name || user.username,
    avatarUrl: user.avatar_url || null,
  }
}

/**
 * Takes an array and chunks it into smaller arrays of the specified size
 */
export function chunkArray<T>(array: T[], chunkSize: number): T[][] {
  if (!array || !array.length) return []
  
  const chunks: T[][] = []
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize))
  }
  
  return chunks
}

/**
 * Formats a date to a human-readable string
 */
export function formatDate(date: Date | string | null): string {
  if (!date) return ''
  
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
} 