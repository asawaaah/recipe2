import { LoginForm } from '@/components/blocks/login-form'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Login | Recipe2',
  description: 'Login to your Recipe2 account',
}

export default function LoginPage() {
  return (
    <div className="container flex min-h-svh items-center justify-center">
      <div className="mx-auto w-full max-w-sm space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome back
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your credentials to sign in to your account
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
} 