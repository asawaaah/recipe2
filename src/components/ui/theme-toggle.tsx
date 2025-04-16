"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function ThemeToggle() {
  // Get theme from next-themes as a fallback
  const { theme, setTheme } = useTheme()
  
  // Try using preferences but fallback to next-themes
  let preferencesAvailable = false
  let preferenceTheme = theme
  
  try {
    // Dynamically import to avoid the error if PreferencesProvider is not available
    const { usePreferences } = require("@/state/hooks/usePreferences")
    const preferences = usePreferences()
    if (preferences && preferences.theme) {
      preferencesAvailable = true
      preferenceTheme = preferences.theme
    }
  } catch (error) {
    // Silently fail and use next-themes
  }
  
  // Function to set theme that works with both systems
  const handleSetTheme = (newTheme: string) => {
    if (preferencesAvailable) {
      try {
        const { usePreferences } = require("@/state/hooks/usePreferences")
        const { setTheme: setPreferenceTheme } = usePreferences()
        setPreferenceTheme(newTheme as any)
      } catch (error) {
        // Fall back to next-themes
        setTheme(newTheme)
      }
    } else {
      setTheme(newTheme)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleSetTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleSetTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleSetTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 