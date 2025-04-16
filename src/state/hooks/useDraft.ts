'use client'

import { useState, useEffect } from 'react'
import { getStorageItem, setStorageItem, removeStorageItem } from '../utils/storage'

/**
 * Hook for managing draft data in localStorage
 * 
 * @param key The storage key for the draft
 * @param initialData The initial data
 * @returns An object with the draft data, a function to update it, and a function to clear it
 */
export function useDraft<T>(key: string, initialData: T) {
  // Load draft from localStorage or use initialData
  const [data, setData] = useState<T>(() => {
    return getStorageItem<T>(key, initialData)
  })
  
  // Save draft to localStorage whenever it changes
  useEffect(() => {
    // Deep equality check would be better, but for simple usage this is adequate
    const currentStoredData = getStorageItem<T>(key, initialData);
    // Only update storage if the data has actually changed
    if (JSON.stringify(currentStoredData) !== JSON.stringify(data)) {
      setStorageItem(key, data);
    }
  }, [key, data, initialData]);
  
  // Update draft data
  const updateDraft = (newData: T | ((prevData: T) => T)) => {
    if (typeof newData === 'function') {
      // @ts-ignore - TypeScript doesn't correctly infer the function type
      setData(prev => (newData as ((prevData: T) => T))(prev))
    } else {
      setData(newData)
    }
  }
  
  // Clear draft data
  const clearDraft = () => {
    removeStorageItem(key)
    setData(initialData)
  }
  
  return {
    draft: data,
    updateDraft,
    clearDraft,
  }
} 