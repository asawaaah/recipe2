'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { usePreferences } from "@/state/providers/PreferencesProvider"
import { useLang } from "@/app/providers"
import { getStorageItem, STORAGE_KEYS, PREFIX } from "@/state/utils/storage"
import { Locale } from "@/middleware"

export function StorageDemo() {
  const { language, setLanguage } = usePreferences()
  const currentLang = useLang()
  const [storageData, setStorageData] = useState<Record<string, any>>({})
  const [isClient, setIsClient] = useState(false)
  
  // Get all language-related storage data
  const refreshStorageData = () => {
    if (typeof window === 'undefined') return

    const data: Record<string, any> = {}
    
    // Get values for both language storage keys
    data[`${STORAGE_KEYS.LANGUAGE}`] = 
      getStorageItem(STORAGE_KEYS.LANGUAGE, null)
    
    data[`${STORAGE_KEYS.PREFERRED_LANGUAGE}`] = 
      getStorageItem(STORAGE_KEYS.PREFERRED_LANGUAGE, null)
    
    // Get the raw localStorage keys with prefix for demonstration
    const prefix = PREFIX || 'recipe2:'
    
    try {
      // Get all stored keys (with their prefixes)
      Object.keys(window.localStorage)
        .filter(key => key.includes('language') || key.includes('LANGUAGE'))
        .forEach(key => {
          try {
            data[key] = JSON.parse(window.localStorage.getItem(key) || 'null')
          } catch (e) {
            data[key] = window.localStorage.getItem(key)
          }
        })
    } catch (error) {
      console.error("Error accessing localStorage:", error)
    }
    
    setStorageData(data)
  }
  
  // Mark when component is mounted on client
  useEffect(() => {
    setIsClient(true)
  }, [])
  
  // Refresh storage data on language change, but only on client
  useEffect(() => {
    if (isClient) {
      refreshStorageData()
    }
  }, [language, currentLang, isClient])
  
  // Initial load on client only
  useEffect(() => {
    if (isClient) {
      refreshStorageData()
    }
  }, [isClient])
  
  return (
    <Card className="w-full max-w-xl mx-auto">
      <CardHeader>
        <CardTitle>Language Storage Demo</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-2">
          <p>Current URL language: <strong>{currentLang}</strong></p>
          <p>Preferred language: <strong>{language}</strong></p>
        </div>
        
        {isClient && (
          <div className="mt-4">
            <h3 className="text-lg font-medium mb-2">Storage Contents:</h3>
            <div className="bg-muted p-4 rounded-md text-sm font-mono overflow-x-auto">
              <pre>{JSON.stringify(storageData, null, 2)}</pre>
            </div>
          </div>
        )}
        
        <div className="flex justify-between mt-4">
          <Button 
            onClick={() => setLanguage('en')} 
            variant="outline" 
            size="sm"
          >
            Set to English
          </Button>
          <Button 
            onClick={() => setLanguage('es')} 
            variant="outline" 
            size="sm"
          >
            Set to Spanish
          </Button>
          <Button 
            onClick={refreshStorageData} 
            variant="default" 
            size="sm"
          >
            Refresh Storage Data
          </Button>
        </div>
      </CardContent>
    </Card>
  )
} 