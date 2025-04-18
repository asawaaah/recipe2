import { LoginForm } from '@/components/blocks/login-form'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Login | Recipe2',
  description: 'Login to your Recipe2 account',
}

export default async function LoginPage({
  params
}: {
  params: { lang: string }
}) {
  // Await params to access its properties
  const { lang } = await params;
  
  return (
    <div className="bg-muted min-h-svh">
      <div className="container flex min-h-svh items-center justify-center">
        <div className="mx-auto w-full max-w-4xl">
          <LoginForm lang={lang} />
        </div>
      </div>
    </div>
  )
} 