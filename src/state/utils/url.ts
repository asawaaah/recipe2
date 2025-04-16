'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'

/**
 * Hook for managing URL query parameters
 */
export function useUrlState() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  
  /**
   * Set a URL parameter
   */
  const setParam = useCallback(
    (key: string, value: string | number | boolean | undefined | null) => {
      const params = new URLSearchParams(searchParams.toString())
      
      if (value === undefined || value === null || value === '') {
        params.delete(key)
      } else {
        params.set(key, String(value))
      }
      
      const newSearch = params.toString()
      const query = newSearch ? `?${newSearch}` : ''
      
      router.push(`${pathname}${query}`)
    },
    [searchParams, pathname, router]
  )
  
  /**
   * Set multiple URL parameters at once
   */
  const setParams = useCallback(
    (params: Record<string, string | number | boolean | undefined | null>) => {
      const urlParams = new URLSearchParams(searchParams.toString())
      
      Object.entries(params).forEach(([key, value]) => {
        if (value === undefined || value === null || value === '') {
          urlParams.delete(key)
        } else {
          urlParams.set(key, String(value))
        }
      })
      
      const newSearch = urlParams.toString()
      const query = newSearch ? `?${newSearch}` : ''
      
      router.push(`${pathname}${query}`)
    },
    [searchParams, pathname, router]
  )
  
  /**
   * Get a URL parameter
   */
  const getParam = useCallback(
    (key: string) => {
      return searchParams.get(key)
    },
    [searchParams]
  )
  
  /**
   * Clear all URL parameters
   */
  const clearParams = useCallback(() => {
    router.push(pathname)
  }, [pathname, router])
  
  return {
    setParam,
    setParams,
    getParam,
    clearParams,
    searchParams,
  }
} 