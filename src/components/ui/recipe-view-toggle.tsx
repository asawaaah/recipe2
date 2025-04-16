"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { Grid, List } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export function RecipeViewToggle() {
  // Default state if preferences aren't available
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [preferencesAvailable, setPreferencesAvailable] = useState(false)

  useEffect(() => {
    // Try to access preferences on the client side
    try {
      const { usePreferences } = require("@/state/hooks/usePreferences")
      const { recipeViewMode } = usePreferences()
      setViewMode(recipeViewMode)
      setPreferencesAvailable(true)
    } catch (error) {
      // Fallback to local state if preferences aren't available
      console.warn("PreferencesProvider not available, using local state for view mode")
    }
  }, [])

  const handleSetViewMode = (mode: "grid" | "list") => {
    if (preferencesAvailable) {
      try {
        const { usePreferences } = require("@/state/hooks/usePreferences")
        const { setRecipeViewMode } = usePreferences()
        setRecipeViewMode(mode)
      } catch (error) {
        // Fallback to local state
        setViewMode(mode)
      }
    } else {
      setViewMode(mode)
    }
  }

  return (
    <TooltipProvider>
      <div className="flex items-center gap-1 rounded-md border p-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="icon"
              className="h-8 w-8"
              onClick={() => handleSetViewMode("grid")}
            >
              <Grid className="h-4 w-4" />
              <span className="sr-only">Grid view</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">Grid view</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="icon"
              className="h-8 w-8"
              onClick={() => handleSetViewMode("list")}
            >
              <List className="h-4 w-4" />
              <span className="sr-only">List view</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">List view</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  )
} 