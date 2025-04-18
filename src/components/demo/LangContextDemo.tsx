'use client'

import { useLang } from '@/app/providers'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Languages } from 'lucide-react'
import { LocalizedLink } from '@/components/i18n/LocalizedLink'

export function LangContextDemo() {
  // Get the current language from context
  const currentLang = useLang()
  
  return (
    <Card className="w-full max-w-xl mx-auto">
      <CardHeader>
        <CardTitle>Language Context Demo</CardTitle>
        <CardDescription>
          Demonstrating direct use of the LangContext through the useLang hook
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 rounded-md bg-muted">
          <p className="text-center font-medium">Current Language: <span className="font-bold">{currentLang}</span></p>
        </div>
        
        <div className="flex flex-col gap-2">
          <p>The useLang hook provides direct access to the current language without needing to use the translation dictionary:</p>
          <pre className="bg-secondary p-2 rounded-md text-sm overflow-auto">
            {`const currentLang = useLang();
console.log("Current language is", currentLang);`}
          </pre>
        </div>
        
        <div className="flex justify-center mt-4 gap-4">
          <Button asChild variant="outline">
            <LocalizedLink href="/translation-demo">
              Translation Demo
            </LocalizedLink>
          </Button>
          <Button asChild>
            <LocalizedLink href="/">
              Home
            </LocalizedLink>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
} 