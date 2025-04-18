"use client"

import * as React from "react"
import { Grid, List } from "lucide-react"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { usePreferences } from "@/state/hooks/usePreferences"

export function RecipeViewToggle() {
  const { recipeViewMode, setRecipeViewMode } = usePreferences()
  // Use local state to track the view mode after hydration
  const [viewMode, setViewMode] = useState<'grid' | 'list'>("grid")
  
  // Update local state when the preference changes or after hydration
  useEffect(() => {
    setViewMode(recipeViewMode)
  }, [recipeViewMode])

  return (
    <TooltipProvider>
      <div className="flex items-center gap-1 rounded-md border p-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="icon"
              className="h-8 w-8"
              onClick={() => setRecipeViewMode("grid")}
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
              onClick={() => setRecipeViewMode("list")}
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