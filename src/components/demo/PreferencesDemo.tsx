'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { usePreferences } from "@/state/providers/PreferencesProvider"
import { useLang } from "@/app/providers"
import { LocalizedLink } from '@/components/i18n/LocalizedLink'

export function PreferencesDemo() {
  const { language, setLanguage } = usePreferences()
  const currentLang = useLang()
  const [message, setMessage] = useState<string | null>(null)
  
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' }
  ]
  
  const handleLanguageChange = (lang: string) => {
    setLanguage(lang as any)
    setMessage(`Preference set to ${lang}. This will be remembered on your next visit.`)
  }
  
  return (
    <Card className="w-full max-w-xl mx-auto">
      <CardHeader>
        <CardTitle>Language Preferences Demo</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-2">
          <p>Current URL language: <strong>{currentLang}</strong></p>
          <p>Preferred language: <strong>{language}</strong></p>
          
          {message && (
            <div className="p-3 bg-muted rounded-md text-sm mt-2">
              {message}
            </div>
          )}
        </div>
        
        <div className="grid gap-2">
          <p className="font-medium">Set your preferred language:</p>
          <div className="flex gap-2">
            {languages.map((lang) => (
              <Button 
                key={lang.code}
                variant={language === lang.code ? "default" : "outline"}
                onClick={() => handleLanguageChange(lang.code)}
              >
                {lang.name}
              </Button>
            ))}
          </div>
        </div>
        
        <div className="pt-4 border-t">
          <p className="text-sm text-muted-foreground mb-2">
            Your language preference will be saved in local storage and remembered 
            the next time you visit. Try setting a preference and then refreshing the page.
          </p>
          <Button asChild variant="outline" size="sm">
            <LocalizedLink href="/">Back to Home</LocalizedLink>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
} 