'use client'

import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { cn } from "@/lib/utils"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { SignInInput, signInSchema } from '@/lib/validators/auth'
import { Icons } from '@/components/ui/icons'
import { GoogleLogo } from '@/components/svg/google'
import { useAuthActions } from '@/state/hooks/useAuthActions'
import { useTranslation } from '@/components/i18n/TranslationContext'
import { LocalizedLink } from '@/components/i18n/LocalizedLink'
import { Locale, locales, defaultLocale } from '@/middleware'

interface LoginFormProps extends React.ComponentProps<"div"> {
  lang?: string
}

export function LoginForm({
  className,
  lang,
  ...props
}: LoginFormProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { t } = useTranslation()
  const { signIn, signInWithGoogle, isLoading, error } = useAuthActions()

  // Extract language from URL path or use provided lang or default
  const pathLang = pathname?.split('/')?.[1] as Locale
  const isValidLocale = locales.includes(pathLang as Locale)
  const currentLang = lang || (isValidLocale ? pathLang : defaultLocale)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
  })

  const onSubmit = async (data: SignInInput) => {
    try {
      await signIn(data)
    } catch (error) {
      console.error('Error in form submission:', error)
    }
  }

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle()
    } catch (error) {
      console.error('Error with Google login:', error)
    }
  }

  const signupPath = currentLang ? `/${currentLang}/signup` : '/signup';

  return (
    <div className={cn("flex flex-col gap-2", className)} {...props}>
      <Card className="overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">{t('auth.login.title')}</h1>
                <p className="text-balance text-muted-foreground">
                  {t('auth.login.subtitle')}
                </p>
              </div>
              {error && (
                <div className="text-sm text-red-500 text-center">{error}</div>
              )}
              <div className="grid gap-2">
                <Label htmlFor="emailOrUsername">{t('auth.login.emailOrUsername')}</Label>
                <Input
                  id="emailOrUsername"
                  type="text"
                  placeholder={t('auth.login.emailOrUsernamePlaceholder')}
                  disabled={isLoading}
                  {...register('emailOrUsername')}
                />
                {errors.emailOrUsername && (
                  <p className="text-sm text-red-500">{errors.emailOrUsername.message}</p>
                )}
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">{t('auth.login.password')}</Label>
                  <LocalizedLink
                    href="/forgot-password"
                    className="ml-auto text-sm underline-offset-2 hover:underline"
                  >
                    {t('auth.login.forgotPassword')}
                  </LocalizedLink>
                </div>
                <Input
                  id="password"
                  type="password"
                  disabled={isLoading}
                  {...register('password')}
                />
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password.message}</p>
                )}
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? t('auth.login.signingIn') : t('auth.login.signIn')}
              </Button>
              <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                <span className="relative z-10 bg-background px-2 text-muted-foreground">
                  {t('auth.login.or')}
                </span>
              </div>
              <div className="flex justify-center">
                <Button
                  variant="outline"
                  type="button"
                  disabled={isLoading}
                  onClick={handleGoogleLogin}
                  className="w-full"
                >
                  {isLoading ? (
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <GoogleLogo />
                  )}
                  <span className="ml-2">{t('auth.login.continueWithGoogle')}</span>
                </Button>
              </div>
              <div className="text-center text-sm">
                {t('auth.login.noAccount')}{" "}
                <Button 
                  variant="link" 
                  className="p-0 underline underline-offset-4"
                  onClick={() => router.push(signupPath)}
                >
                  {t('auth.login.signUp')}
                </Button>
              </div>
            </div>
          </form>
          <div className="relative hidden bg-muted md:block">
            <img
              src="\images\7eaf2586-11d1-4592-ac21-054fa4efbb8b.png"
              alt={t('auth.login.imageAlt')}
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
        {t('auth.login.termsNotice')}
      </div>
    </div>
  )
}
