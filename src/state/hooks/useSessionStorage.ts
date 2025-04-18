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
  // Always initialize with initialValue on server side
  // This prevents hydration mismatch when server and client differ
  const [value, setValue] = useState<T>(initialValue)
  
  // Only attempt to read from sessionStorage on client-side after mount
  const [isInitialized, setIsInitialized] = useState(false)
  
  // Load value from sessionStorage only on client-side
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    try {
      const item = sessionStorage.getItem(key)
      if (item) {
        setValue(JSON.parse(item))
      }
      setIsInitialized(true)
    } catch (error) {
      console.error(`Error getting item ${key} from sessionStorage:`, error)
    }
  }, [key])
  
  // Update sessionStorage when value changes, but only after initialization
  useEffect(() => {
    if (typeof window === 'undefined' || !isInitialized) return
    
    try {
      if (value === null || value === undefined) {
        sessionStorage.removeItem(key)
      } else {
        sessionStorage.setItem(key, JSON.stringify(value))
      }
    } catch (error) {
      console.error(`Error setting item ${key} in sessionStorage:`, error)
    }
  }, [key, value, isInitialized])
  
  return [value, setValue] as const
} 