'use client'

import { useClientDictionary, formatMessage } from '@/utils/client-dictionary'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LanguageSwitcher } from '@/components/i18n/LanguageSwitcher'

export function ClientTranslationDemo() {
  const { t, locale } = useClientDictionary()
  
  // Example of using the formatMessage function with variables
  const authoredMessage = formatMessage(t('recipe.authoredBy'), { author: 'Chef Claude' })
  
  return (
    <Card className="w-full max-w-xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{t('common.language')}: {locale}</CardTitle>
        <LanguageSwitcher />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-2">
          <h3 className="text-lg font-semibold">{t('recipe.title')}</h3>
          <p>{t('recipe.description')}</p>
        </div>
        
        <div className="grid gap-2">
          <h3 className="text-lg font-semibold">{t('recipe.ingredients')}</h3>
          <ul className="list-disc pl-6">
            <li>Item 1</li>
            <li>Item 2</li>
            <li>Item 3</li>
          </ul>
        </div>
        
        <div className="grid gap-2">
          <h3 className="text-lg font-semibold">{t('recipe.instructions')}</h3>
          <ol className="list-decimal pl-6">
            <li>Step 1</li>
            <li>Step 2</li>
            <li>Step 3</li>
          </ol>
        </div>
        
        <div className="flex items-center justify-between">
          <span>
            {t('recipe.cookingTime')}: 30 {t('recipe.minutes')}
          </span>
          <span>
            {authoredMessage}
          </span>
        </div>
        
        <div className="flex justify-end gap-2">
          <Button variant="outline">{t('common.cancel')}</Button>
          <Button>{t('common.save')}</Button>
        </div>
      </CardContent>
    </Card>
  )
} 