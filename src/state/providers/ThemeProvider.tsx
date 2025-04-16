"use client"

import { useEffect } from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { usePreferences } from "../hooks/usePreferences"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: string
  storageKey?: string
  forcedTheme?: string
  enableSystem?: boolean
  disableTransitionOnChange?: boolean
  themes?: string[]
}

export function ThemeProvider({ 
  children,
  defaultTheme = "system",
  enableSystem = true,
  ...props 
}: ThemeProviderProps) {
  // Safely try to use preferences, but fall back to defaultTheme if not available
  let theme = defaultTheme
  
  try {
    const preferences = usePreferences()
    if (preferences && preferences.theme) {
      theme = preferences.theme
    }
  } catch (error) {
    // If usePreferences throws an error, we'll use the defaultTheme
    console.warn("PreferencesProvider not found, using default theme", error)
  }
  
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme={theme}
      enableSystem={enableSystem}
      storageKey="recipe2:theme" // Match our storage prefix
      {...props}
    >
      {children}
    </NextThemesProvider>
  )
} 