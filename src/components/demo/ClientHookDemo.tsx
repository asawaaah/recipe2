'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useTranslation } from "@/hooks/useTranslation"
import { Locale } from "@/middleware"
import { Skeleton } from "@/components/ui/skeleton"

export function ClientHookDemo() {
  const { t, isLoading, lang } = useTranslation()
  const [count, setCount] = useState(0)
  
  // Set up demo translations that will be available in the dictionary
  const translationKeys = [
    'common.welcome',
    'common.language',
    'common.home',
    'common.allRecipes',
    'common.myCookbook',
    'recipe.ingredients',
    'recipe.cookingTime'
  ]
  
  if (isLoading) {
    return (
      <Card className="w-full max-w-xl mx-auto">
        <CardHeader>
          <Skeleton className="h-8 w-3/4" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-10 w-32" />
        </CardContent>
      </Card>
    )
  }
  
  return (
    <Card className="w-full max-w-xl mx-auto">
      <CardHeader>
        <CardTitle>{t('common.language')}: {lang.toUpperCase()}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="font-medium">{t('common.welcome')}</p>
          <p className="text-sm text-muted-foreground">
            This component uses the useTranslation hook to access translations on the client.
          </p>
        </div>
        
        <div className="grid gap-2">
          <p className="font-medium">Available translations:</p>
          <ul className="list-disc pl-6">
            {translationKeys.map((key) => (
              <li key={key}>
                <code className="text-sm bg-muted px-1 rounded">{key}</code>:
                <span className="ml-2">{t(key)}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="flex items-center justify-between border rounded-md p-4">
          <span>Counter: {count}</span>
          <Button 
            onClick={() => setCount(prev => prev + 1)}
            variant="outline"
          >
            {t('common.increment') || 'Increment'}
          </Button>
        </div>
        
        <p className="text-sm text-muted-foreground mt-4">
          Notice that the language changes instantly when you switch languages,
          and this is a fully interactive client component with state.
        </p>
      </CardContent>
    </Card>
  )
} 