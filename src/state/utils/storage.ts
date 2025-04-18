// Constants
export const PREFIX = 'recipe2:'

/**
 * Get a value from local storage with default value handling
 */
export function getStorageItem<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue
  
  try {
    const item = window.localStorage.getItem(`${PREFIX}${key}`)
    return item ? JSON.parse(item) : defaultValue
  } catch (error) {
    console.error(`Error getting item ${key} from localStorage:`, error)
    return defaultValue
  }
}

/**
 * Set a value in local storage
 */
export function setStorageItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return
  
  try {
    if (value === null || value === undefined) {
      window.localStorage.removeItem(`${PREFIX}${key}`)
    } else {
      window.localStorage.setItem(`${PREFIX}${key}`, JSON.stringify(value))
    }
  } catch (error) {
    console.error(`Error setting item ${key} in localStorage:`, error)
  }
}

/**
 * Remove a value from local storage
 */
export function removeStorageItem(key: string): void {
  if (typeof window === 'undefined') return
  
  try {
    window.localStorage.removeItem(`${PREFIX}${key}`)
  } catch (error) {
    console.error(`Error removing item ${key} from localStorage:`, error)
  }
}

/**
 * Clear all app-related items from local storage
 */
export function clearStorage(): void {
  if (typeof window === 'undefined') return
  
  try {
    Object.keys(window.localStorage)
      .filter(key => key.startsWith(PREFIX))
      .forEach(key => window.localStorage.removeItem(key))
  } catch (error) {
    console.error('Error clearing localStorage:', error)
  }
}

/**
 * Storage keys used in the application
 */
export const STORAGE_KEYS = {
  // Theme and UI
  THEME: 'theme',
  LANGUAGE: 'language',
  PREFERRED_LANGUAGE: 'preferred_language',
  SIDEBAR_STATE: 'sidebar_state',
  UI_DENSITY: 'ui_density',
  RECIPE_VIEW_MODE: 'recipe_view_mode',
  
  // User preferences
  FAVORITE_RECIPES: 'favorite_recipes',
  RECENT_SEARCHES: 'recent_searches',
  FILTER_TAGS: 'filter_tags',
  
  // Drafts and temporary storage
  DRAFT_RECIPE: 'draft_recipe',
  DRAFT_PROFILE: 'draft_profile',
} 