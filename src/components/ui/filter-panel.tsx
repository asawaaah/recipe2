"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { Filter, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useSessionStorage } from "@/state/hooks/useSessionStorage"

export function FilterPanel() {
  // Use sessionStorage for panel visibility state
  const [isOpen, setIsOpen] = useSessionStorage('filter_panel_open', false)
  
  // Default state for when preferences aren't available
  const [filterTags, setFilterTags] = useState<string[]>([])
  const [preferencesAvailable, setPreferencesAvailable] = useState(false)
  
  // Try to access preferences on the client side
  useEffect(() => {
    try {
      const { usePreferences } = require("@/state/hooks/usePreferences")
      const preferences = usePreferences()
      if (preferences && preferences.filterTags) {
        setFilterTags(preferences.filterTags)
        setPreferencesAvailable(true)
      }
    } catch (error) {
      console.warn("PreferencesProvider not available, using local state for filters")
    }
  }, [])

  // Handle filter changes with fallbacks
  const handleToggleFilter = (tag: string) => {
    if (preferencesAvailable) {
      try {
        const { usePreferences } = require("@/state/hooks/usePreferences")
        const { filterTags, addFilterTag, removeFilterTag } = usePreferences()
        
        if (filterTags.includes(tag)) {
          removeFilterTag(tag)
        } else {
          addFilterTag(tag)
        }
      } catch (error) {
        // Fallback to local state
        setFilterTags(prev => 
          prev.includes(tag)
            ? prev.filter(t => t !== tag)
            : [...prev, tag]
        )
      }
    } else {
      // Use local state
      setFilterTags(prev => 
        prev.includes(tag)
          ? prev.filter(t => t !== tag)
          : [...prev, tag]
      )
    }
  }
  
  // Handle clearing all filters
  const clearAllFilters = () => {
    if (preferencesAvailable) {
      try {
        const { usePreferences } = require("@/state/hooks/usePreferences")
        const { clearFilterTags } = usePreferences()
        clearFilterTags()
      } catch (error) {
        setFilterTags([])
      }
    } else {
      setFilterTags([])
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          className="gap-1"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Filter className="h-4 w-4" />
          {isOpen ? "Hide Filters" : "Show Filters"}
        </Button>
        
        {filterTags.length > 0 && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearAllFilters}
          >
            <X className="mr-1 h-4 w-4" />
            Clear All
          </Button>
        )}
      </div>
      
      {isOpen && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Filter Recipes</CardTitle>
            <CardDescription>
              Narrow down recipes by applying filters
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid gap-2">
              <Label htmlFor="search-filter">Search</Label>
              <Input id="search-filter" placeholder="Search recipes..." />
            </div>
            <div className="grid gap-2">
              <Label>Categories</Label>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="breakfast" 
                    checked={filterTags.includes('breakfast')}
                    onCheckedChange={() => handleToggleFilter('breakfast')}
                  />
                  <label
                    htmlFor="breakfast"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Breakfast
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="lunch" 
                    checked={filterTags.includes('lunch')}
                    onCheckedChange={() => handleToggleFilter('lunch')}
                  />
                  <label
                    htmlFor="lunch"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Lunch
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="dinner" 
                    checked={filterTags.includes('dinner')}
                    onCheckedChange={() => handleToggleFilter('dinner')}
                  />
                  <label
                    htmlFor="dinner"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Dinner
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="dessert" 
                    checked={filterTags.includes('dessert')}
                    onCheckedChange={() => handleToggleFilter('dessert')}
                  />
                  <label
                    htmlFor="dessert"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Dessert
                  </label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 