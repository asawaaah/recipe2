import { LoginForm } from '@/components/blocks/login-form'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Login | Recipe2',
  description: 'Login to your Recipe2 account',
}

export default function LoginPage({
  params
}: {
  params: { lang: string }
}) {
  return (
    <div className="bg-muted min-h-svh">
      <div className="container flex min-h-svh items-center justify-center">
        <div className="mx-auto w-full max-w-4xl">
          <LoginForm lang={params.lang} />
        </div>
      </div>
    </div>
  )
} 