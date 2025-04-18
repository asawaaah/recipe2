'use client'

import { useState } from 'react'
import { Locale } from '@/middleware'
import { Recipe } from '@/services/recipes/types'
import { TranslationForm } from './TranslationForm'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { InfoIcon } from 'lucide-react'

// List of all supported locales
const SUPPORTED_LOCALES: Locale[] = ['en', 'es', 'fr', 'de']

interface TranslationManagerProps {
  recipe: Recipe
  locale: Locale
  defaultLanguage?: Locale // The language the recipe was originally created in
}

export function TranslationManager({ recipe, locale, defaultLanguage = 'en' }: TranslationManagerProps) {
  const [activeLocale, setActiveLocale] = useState<Locale>(locale)
  
  // Filter out the source language (original recipe language)
  const targetLocales = SUPPORTED_LOCALES.filter(l => l !== defaultLanguage)
  
  // Determine if current locale can edit (only original language or admin can edit all)
  const canEdit = locale === defaultLanguage // In a real app, also check for admin rights

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Translation Settings</CardTitle>
          <CardDescription>
            Original recipe language: <strong>{defaultLanguage.toUpperCase()}</strong>
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!canEdit && (
            <Alert className="mb-4">
              <InfoIcon className="h-4 w-4" />
              <AlertDescription>
                You can only view translations in this mode. To edit translations, 
                switch to the original language of the recipe.
              </AlertDescription>
            </Alert>
          )}
          
          <Tabs defaultValue={activeLocale} onValueChange={(value) => setActiveLocale(value as Locale)}>
            <TabsList className="grid" style={{ gridTemplateColumns: `repeat(${targetLocales.length}, 1fr)` }}>
              {targetLocales.map((lang) => (
                <TabsTrigger key={lang} value={lang}>{lang.toUpperCase()}</TabsTrigger>
              ))}
            </TabsList>
            
            {targetLocales.map((lang) => (
              <TabsContent key={lang} value={lang} className="py-4">
                <TranslationForm 
                  recipeId={recipe.id}
                  originalTitle={recipe.title}
                  originalDescription={recipe.description}
                  translations={recipe.translations}
                  readOnly={!canEdit}
                />
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
} 