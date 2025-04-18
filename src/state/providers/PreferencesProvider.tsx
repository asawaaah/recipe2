'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { getStorageItem, setStorageItem, STORAGE_KEYS } from '../utils/storage'
import { Locale, defaultLocale, locales } from '@/middleware'
import { useLang } from '@/app/providers'
import { usePathname, useRouter } from 'next/navigation'

type PreferencesContextType = {
  // Recipe favorites
  favoriteRecipes: string[]
  addFavorite: (recipeId: string) => void
  removeFavorite: (recipeId: string) => void
  isFavorite: (recipeId: string) => boolean
  
  // UI preferences
  recipeViewMode: 'grid' | 'list'
  setRecipeViewMode: (mode: 'grid' | 'list') => void
  
  // Theme preferences
  theme: 'light' | 'dark' | 'system'
  setTheme: (theme: 'light' | 'dark' | 'system') => void
  
  // Language preferences
  language: Locale
  setLanguage: (language: Locale) => void
  
  // Recipe filters
  filterTags: string[]
  addFilterTag: (tag: string) => void
  removeFilterTag: (tag: string) => void
  clearFilterTags: () => void
  
  // User UI settings
  uiDensity: 'comfortable' | 'compact'
  setUiDensity: (density: 'comfortable' | 'compact') => void
  
  // Recent searches
  recentSearches: string[]
  addRecentSearch: (search: string) => void
  clearRecentSearches: () => void
}

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined)

interface PreferencesProviderProps {
  children: ReactNode
  initialLanguage?: Locale
}

export function PreferencesProvider({ 
  children, 
  initialLanguage 
}: PreferencesProviderProps) {
  // Get the current URL language from path
  const pathname = usePathname()
  const pathLang = pathname?.split('/')?.[1] as Locale
  const isValidLocale = locales.includes(pathLang as Locale)
  
  // Get the current URL language from context as fallback
  const contextLang = useLang()
  
  // Use path language if valid, otherwise context language
  const urlLang = isValidLocale ? pathLang : contextLang
  
  // Load initial state from localStorage with default values
  const [favoriteRecipes, setFavoriteRecipes] = useState<string[]>(
    getStorageItem(STORAGE_KEYS.FAVORITE_RECIPES, [])
  )
  
  const [recipeViewMode, setRecipeViewMode] = useState<'grid' | 'list'>(
    getStorageItem(STORAGE_KEYS.RECIPE_VIEW_MODE, 'grid')
  )
  
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>(
    getStorageItem(STORAGE_KEYS.THEME, 'system')
  )
  
  const [language, setLanguage] = useState<Locale>(
    // Initialize with URL language, provided language, fall back to stored preference or default
    urlLang || 
    initialLanguage || 
    getStorageItem(STORAGE_KEYS.PREFERRED_LANGUAGE, 
      getStorageItem(STORAGE_KEYS.LANGUAGE, defaultLocale)
    )
  )
  
  const [filterTags, setFilterTags] = useState<string[]>(
    getStorageItem(STORAGE_KEYS.FILTER_TAGS, [])
  )
  
  const [uiDensity, setUiDensity] = useState<'comfortable' | 'compact'>(
    getStorageItem(STORAGE_KEYS.UI_DENSITY, 'comfortable')
  )
  
  const [recentSearches, setRecentSearches] = useState<string[]>(
    getStorageItem(STORAGE_KEYS.RECENT_SEARCHES, [])
  )
  
  // Update state when URL changes
  useEffect(() => {
    if (urlLang && urlLang !== language) {
      setLanguage(urlLang)
    }
  }, [urlLang, language])
  
  // Persist state changes to localStorage
  useEffect(() => {
    setStorageItem(STORAGE_KEYS.FAVORITE_RECIPES, favoriteRecipes)
  }, [favoriteRecipes])
  
  useEffect(() => {
    setStorageItem(STORAGE_KEYS.RECIPE_VIEW_MODE, recipeViewMode)
  }, [recipeViewMode])
  
  useEffect(() => {
    setStorageItem(STORAGE_KEYS.THEME, theme)
  }, [theme])
  
  useEffect(() => {
    setStorageItem(STORAGE_KEYS.LANGUAGE, language)
    setStorageItem(STORAGE_KEYS.PREFERRED_LANGUAGE, language)
  }, [language])
  
  useEffect(() => {
    setStorageItem(STORAGE_KEYS.FILTER_TAGS, filterTags)
  }, [filterTags])
  
  useEffect(() => {
    setStorageItem(STORAGE_KEYS.UI_DENSITY, uiDensity)
  }, [uiDensity])
  
  useEffect(() => {
    setStorageItem(STORAGE_KEYS.RECENT_SEARCHES, recentSearches)
  }, [recentSearches])
  
  // Favorites management
  const addFavorite = (recipeId: string) => {
    if (!favoriteRecipes.includes(recipeId)) {
      setFavoriteRecipes(prev => [...prev, recipeId])
    }
  }
  
  const removeFavorite = (recipeId: string) => {
    setFavoriteRecipes(prev => prev.filter(id => id !== recipeId))
  }
  
  const isFavorite = (recipeId: string) => {
    return favoriteRecipes.includes(recipeId)
  }
  
  // Recipe filter management
  const addFilterTag = (tag: string) => {
    if (!filterTags.includes(tag)) {
      setFilterTags(prev => [...prev, tag])
    }
  }
  
  const removeFilterTag = (tag: string) => {
    setFilterTags(prev => prev.filter(t => t !== tag))
  }
  
  const clearFilterTags = () => {
    setFilterTags([])
  }
  
  // Recent searches management
  const addRecentSearch = (search: string) => {
    if (search.trim()) {
      // Remove it if it already exists (to move it to the front)
      const updatedSearches = recentSearches.filter(s => s !== search)
      // Add to the beginning and limit to 10 recent searches
      setRecentSearches([search, ...updatedSearches].slice(0, 10))
    }
  }
  
  const clearRecentSearches = () => {
    setRecentSearches([])
  }
  
  return (
    <PreferencesContext.Provider value={{
      // Favorites
      favoriteRecipes,
      addFavorite,
      removeFavorite,
      isFavorite,
      
      // View mode
      recipeViewMode,
      setRecipeViewMode,
      
      // Theme
      theme,
      setTheme,
      
      // Language
      language,
      setLanguage,
      
      // Filters
      filterTags,
      addFilterTag,
      removeFilterTag,
      clearFilterTags,
      
      // UI Density
      uiDensity,
      setUiDensity,
      
      // Recent searches
      recentSearches,
      addRecentSearch,
      clearRecentSearches
    }}>
      {children}
    </PreferencesContext.Provider>
  )
}

export const usePreferences = () => {
  const context = useContext(PreferencesContext)
  if (context === undefined) {
    throw new Error('usePreferences must be used within a PreferencesProvider')
  }
  return context
} 