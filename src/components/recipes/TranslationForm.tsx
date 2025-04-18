'use client'

import { useState, useEffect } from 'react'
import { Locale, locales } from '@/middleware'
import { RecipeTranslation } from '@/services/recipes/types'
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle, 
  CardFooter 
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Check, Loader2, X } from 'lucide-react'
import { useLang } from '@/app/providers'

interface TranslationFormProps {
  recipeId: string
  originalTitle: string
  originalDescription: string
  translations?: RecipeTranslation[]
  onSave?: (translation: Partial<RecipeTranslation>) => Promise<boolean>
}

export function TranslationForm({
  recipeId,
  originalTitle,
  originalDescription,
  translations = [],
  onSave
}: TranslationFormProps) {
  const currentLang = useLang()
  
  // State for the currently selected language
  const [selectedLocale, setSelectedLocale] = useState<Locale>(currentLang)
  
  // State for the form values
  const [formValues, setFormValues] = useState<Record<string, { title: string, description: string }>>({})
  
  // Loading and success states
  const [isLoading, setIsLoading] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle')
  
  // Initialize form values from translations
  useEffect(() => {
    const values: Record<string, { title: string, description: string }> = {}
    
    // Fill in values from existing translations
    translations.forEach(translation => {
      values[translation.locale] = {
        title: translation.title,
        description: translation.description
      }
    })
    
    // Ensure all locales have a value (default to original values)
    locales.forEach(locale => {
      if (!values[locale]) {
        values[locale] = {
          title: locale === currentLang ? originalTitle : '',
          description: locale === currentLang ? originalDescription : ''
        }
      }
    })
    
    setFormValues(values)
  }, [translations, currentLang, originalTitle, originalDescription])
  
  // Handle input changes
  const handleInputChange = (
    locale: string,
    field: 'title' | 'description',
    value: string
  ) => {
    setFormValues(prev => ({
      ...prev,
      [locale]: {
        ...prev[locale],
        [field]: value
      }
    }))
  }
  
  // Handle form submission
  const handleSubmit = async () => {
    if (!onSave) return
    
    setIsLoading(true)
    setSaveStatus('idle')
    
    try {
      const result = await onSave({
        recipe_id: recipeId,
        locale: selectedLocale,
        title: formValues[selectedLocale].title || originalTitle,
        description: formValues[selectedLocale].description || originalDescription
      })
      
      setSaveStatus(result ? 'success' : 'error')
    } catch (error) {
      console.error('Error saving translation:', error)
      setSaveStatus('error')
    } finally {
      setIsLoading(false)
      
      // Reset status after 3 seconds
      setTimeout(() => {
        setSaveStatus('idle')
      }, 3000)
    }
  }
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Translate Recipe Content</CardTitle>
        <CardDescription>
          Manage translations for this recipe in different languages
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs 
          value={selectedLocale} 
          onValueChange={(value) => setSelectedLocale(value as Locale)}
          className="w-full"
        >
          <TabsList className="mb-4">
            {locales.map(locale => (
              <TabsTrigger 
                key={locale} 
                value={locale}
                className="capitalize"
              >
                {locale}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {locales.map(locale => (
            <TabsContent key={locale} value={locale} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor={`title-${locale}`}>Title</Label>
                <Input
                  id={`title-${locale}`}
                  value={formValues[locale]?.title || ''}
                  onChange={(e) => handleInputChange(locale, 'title', e.target.value)}
                  placeholder={locale === currentLang ? originalTitle : `Title in ${locale}`}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`description-${locale}`}>Description</Label>
                <Textarea
                  id={`description-${locale}`}
                  value={formValues[locale]?.description || ''}
                  onChange={(e) => handleInputChange(locale, 'description', e.target.value)}
                  placeholder={locale === currentLang ? originalDescription : `Description in ${locale}`}
                  rows={4}
                />
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <div className="text-sm text-muted-foreground">
          {saveStatus === 'success' && (
            <span className="flex items-center text-green-600">
              <Check className="mr-1 h-4 w-4" />
              Translation saved successfully
            </span>
          )}
          
          {saveStatus === 'error' && (
            <span className="flex items-center text-red-600">
              <X className="mr-1 h-4 w-4" />
              Error saving translation
            </span>
          )}
        </div>
        
        <Button 
          onClick={handleSubmit} 
          disabled={isLoading || !onSave}
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Translation
        </Button>
      </CardFooter>
    </Card>
  )
} 