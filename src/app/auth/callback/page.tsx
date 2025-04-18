'use client'

import { useEffect, useRef } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { updateUsername } from '@/lib/auth'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useState } from 'react'
import { useTranslation } from '@/components/i18n/TranslationContext'
import { Locale, locales, defaultLocale } from '@/middleware'

export default function AuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState(false)
  const [showUsernameDialog, setShowUsernameDialog] = useState(false)
  const [username, setUsername] = useState('')
  const [error, setError] = useState('')
  const toastShown = useRef(false)

  // Extract language from URL path
  const pathLang = pathname?.split('/')?.[1] as Locale
  const isValidLocale = locales.includes(pathLang as Locale)
  const currentLang = isValidLocale ? pathLang : defaultLocale

  useEffect(() => {
    const supabase = createClient()

    const handleCallback = async () => {
      try {
        const code = searchParams.get('code')
        
        if (!code) {
          throw new Error('No code provided')
        }

        await supabase.auth.exchangeCodeForSession(code)
        
        // Get the user's session
        const { data: { session } } = await supabase.auth.getSession()
        
        if (!session) {
          throw new Error('No session')
        }

        // Check if user has a username
        const { data: user } = await supabase
          .from('users')
          .select('username')
          .eq('id', session.user.id)
          .single()

        if (!user?.username) {
          // Show username dialog for new users
          setShowUsernameDialog(true)
        } else {
          // Only show toast if it hasn't been shown yet
          if (!toastShown.current) {
            toast.success(t('auth.callback.loginSuccess'))
            toastShown.current = true
          }
          router.push(`/${currentLang}/my-cookbook`)
          router.refresh()
        }
      } catch (error) {
        toast.error(t('auth.callback.authFailed'))
        router.push(`/${currentLang}/login`)
      }
    }

    handleCallback()
  }, [searchParams, router, t, currentLang])

  const handleUsernameSubmit = async () => {
    try {
      setIsLoading(true)
      setError('')

      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        throw new Error('No session')
      }

      await updateUsername(session.user.id, username)
      
      await supabase.auth.updateUser({
        data: {
          display_name: username
        }
      })
      
      toast.success(t('auth.callback.welcomeMessage'))
      router.push(`/${currentLang}/my-cookbook`)
      router.refresh()
    } catch (error) {
      setError(error instanceof Error ? error.message : t('auth.callback.usernameUpdateFailed'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-svh items-center justify-center">
      <Dialog open={showUsernameDialog} onOpenChange={setShowUsernameDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('auth.callback.chooseUsername')}</DialogTitle>
            <DialogDescription>
              {t('auth.callback.usernameDescription')}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="username">{t('auth.common.username')}</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={t('auth.callback.usernamePlaceholder')}
              />
              {error && <p className="text-sm text-red-500">{error}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleUsernameSubmit} disabled={isLoading}>
              {isLoading ? t('auth.callback.saving') : t('auth.callback.saveUsername')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <div className="animate-pulse text-center text-muted-foreground">
        {t('auth.callback.authenticating')}
      </div>
    </div>
  )
} 