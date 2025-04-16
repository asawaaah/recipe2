'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { SignUpInput, signUpSchema } from '@/lib/validators/auth'
import { Separator } from '@/components/ui/separator'
import { useAuthActions } from '@/state/hooks/useAuthActions'

type FormStep = 'email' | 'username' | 'password'

const slideAnimation = {
  initial: { x: 20, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: -20, opacity: 0 },
  transition: { duration: 0.3 }
}

export function SignUpForm() {
  const router = useRouter()
  const { signUp, signInWithGoogle, isLoading, error } = useAuthActions()
  const [currentStep, setCurrentStep] = useState<FormStep>('email')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    trigger,
  } = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
  })

  const email = watch('email')
  const username = watch('username')

  const onSubmit = async (data: SignUpInput) => {
    try {
      await signUp(data)
    } catch (error) {
      console.error('Error in form submission:', error)
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle()
    } catch (error) {
      console.error('Error with Google signin:', error)
    }
  }

  const handleContinueWithEmail = async () => {
    const isValid = await trigger('email')
    if (isValid) {
      setCurrentStep('username')
    }
  }

  const handleSetUsername = async () => {
    const isValid = await trigger('username')
    if (isValid) {
      setCurrentStep('password')
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">Create an account</CardTitle>
        <CardDescription>Enter your details to get started</CardDescription>
        {error && (
          <p className="text-sm text-red-500 mt-2">{error}</p>
        )}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <AnimatePresence mode="wait">
            {currentStep === 'email' && (
              <motion.div
                key="email-step"
                {...slideAnimation}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    disabled={isLoading}
                    {...register('email')}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500">{errors.email.message}</p>
                  )}
                </div>
                <Button
                  type="button"
                  className="w-full"
                  disabled={isLoading || !email}
                  onClick={handleContinueWithEmail}
                >
                  Continue with email
                </Button>

                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <Separator />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  type="button"
                  disabled={isLoading}
                  className="w-full"
                  onClick={handleGoogleSignIn}
                >
                  <svg role="img" viewBox="0 0 24 24" className="mr-2 h-4 w-4">
                    <path
                      fill="currentColor"
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                    />
                  </svg>
                  Sign up with Google
                </Button>
              </motion.div>
            )}

            {currentStep === 'username' && (
              <motion.div
                key="username-step"
                {...slideAnimation}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="username">Choose a username</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="johndoe"
                    disabled={isLoading}
                    {...register('username')}
                  />
                  {errors.username && (
                    <p className="text-sm text-red-500">{errors.username.message}</p>
                  )}
                </div>
                <Button
                  type="button"
                  className="w-full"
                  disabled={isLoading || !username}
                  onClick={handleSetUsername}
                >
                  Set my username
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full"
                  onClick={() => setCurrentStep('email')}
                >
                  Back
                </Button>
              </motion.div>
            )}

            {currentStep === 'password' && (
              <motion.div
                key="password-step"
                {...slideAnimation}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="password">Create a password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      disabled={isLoading}
                      {...register('password')}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-red-500">{errors.password.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      disabled={isLoading}
                      {...register('confirmPassword')}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
                  )}
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Creating account...' : 'Create account'}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full"
                  onClick={() => setCurrentStep('username')}
                >
                  Back
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Button 
            variant="link" 
            className="h-auto p-0 text-primary"
            onClick={() => router.push('/login')}
          >
            Sign in
          </Button>
        </p>
      </CardFooter>
    </Card>
  )
} 