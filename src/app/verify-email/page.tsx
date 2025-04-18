'use client'

import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Mail } from 'lucide-react'
import { useTranslation } from '@/components/i18n/TranslationContext'
import { LocalizedLink } from '@/components/i18n/LocalizedLink'
import { Locale, locales, defaultLocale } from '@/middleware'

export default function VerifyEmailPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const { t } = useTranslation()
  const email = searchParams.get('email')

  // Extract language from URL path
  const pathLang = pathname?.split('/')?.[1] as Locale
  const isValidLocale = locales.includes(pathLang as Locale)
  const currentLang = isValidLocale ? pathLang : defaultLocale
  
  // Redirect to signup if no email
  if (!email) {
    const signupPath = `/${currentLang}/signup`
    router.push(signupPath)
    return null
  }

  const loginPath = `/${currentLang}/login`

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm space-y-6">
        <Card className="w-full">
          <CardHeader className="space-y-3 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-2xl">{t('auth.verifyEmail.title')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <p className="text-muted-foreground">
              {t('auth.verifyEmail.sentVerificationLink')}
            </p>
            <p className="font-medium">{email}</p>
            <p className="text-sm text-muted-foreground">
              {t('auth.verifyEmail.checkSpam')}
            </p>
          </CardContent>
          <CardFooter>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => router.push(loginPath)}
            >
              {t('auth.verifyEmail.backToLogin')}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
} 