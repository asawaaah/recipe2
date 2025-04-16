'use client'

import { useState, useEffect } from 'react'

/**
 * Hook for managing state in sessionStorage
 * 
 * @param key The storage key
 * @param initialValue The initial value
 * @returns An array with the value and a function to set it
 */
export function useSessionStorage<T>(key: string, initialValue: T) {
  // Get from sessionStorage or use initialValue
  const [value, setValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue
    
    try {
      const item = sessionStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(`Error getting item ${key} from sessionStorage:`, error)
      return initialValue
    }
  })
  
  // Update sessionStorage when value changes
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    try {
      if (value === null || value === undefined) {
        sessionStorage.removeItem(key)
      } else {
        sessionStorage.setItem(key, JSON.stringify(value))
      }
    } catch (error) {
      console.error(`Error setting item ${key} in sessionStorage:`, error)
    }
  }, [key, value])
  
  return [value, setValue] as const
} 