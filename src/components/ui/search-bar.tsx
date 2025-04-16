"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useUrlState } from "@/state/utils/url"

interface SearchBarProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onSearch?: (value: string) => void
}

export function SearchBar({ className, onSearch, ...props }: SearchBarProps) {
  // Use useUrlState to persist search in URL for sharing
  const { setParam, getParam } = useUrlState()
  const searchParam = getParam('q') || ''
  
  // Track search input value
  const [value, setValue] = React.useState(searchParam)
  
  // Handle search input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
  }
  
  // Check if preferences are available
  const [preferencesAvailable, setPreferencesAvailable] = useState(false)
  
  useEffect(() => {
    try {
      const { usePreferences } = require("@/state/hooks/usePreferences")
      const preferences = usePreferences()
      if (preferences && preferences.addRecentSearch) {
        setPreferencesAvailable(true)
      }
    } catch (error) {
      console.warn("PreferencesProvider not available, recent searches will not be saved")
    }
  }, [])
  
  // Handle search submission
  const handleSearch = () => {
    setParam('q', value)
    
    if (value.trim() && preferencesAvailable) {
      try {
        const { usePreferences } = require("@/state/hooks/usePreferences")
        const { addRecentSearch } = usePreferences()
        addRecentSearch(value.trim())
      } catch (error) {
        // Silently fail if preferences become unavailable
      }
    }
    
    if (onSearch) {
      onSearch(value)
    }
  }
  
  // Handle search on Enter key
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }
  
  // Clear search
  const handleClear = () => {
    setValue('')
    setParam('q', '')
    
    if (onSearch) {
      onSearch('')
    }
  }
  
  // Keep state in sync with URL param
  React.useEffect(() => {
    if (searchParam !== value) {
      setValue(searchParam)
    }
  }, [searchParam])
  
  return (
    <div className="relative flex w-full max-w-sm items-center">
      <Input
        type="text"
        placeholder="Search recipes..."
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className="pr-10"
        {...props}
      />
      <div className="absolute right-0 flex pr-3">
        {value && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClear}
            className="h-6 w-6"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Clear search</span>
          </Button>
        )}
        <Button
          type="submit"
          variant="ghost"
          size="icon"
          onClick={handleSearch}
          className="h-6 w-6"
        >
          <Search className="h-4 w-4" />
          <span className="sr-only">Search</span>
        </Button>
      </div>
    </div>
  )
} 