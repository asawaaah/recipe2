'use client'

import { useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { updateUsername } from '@/lib/auth'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useState } from 'react'

export default function AuthCallbackPage({
  params
}: {
  params: { lang: string }
}) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const [showUsernameDialog, setShowUsernameDialog] = useState(false)
  const [username, setUsername] = useState('')
  const [error, setError] = useState('')
  const toastShown = useRef(false)

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
            toast.success('You are now logged in using your Google account!')
            toastShown.current = true
          }
          router.push(`/${params.lang}/my-cookbook`)
          router.refresh()
        }
      } catch (error) {
        toast.error('Authentication failed')
        router.push(`/${params.lang}/login`)
      }
    }

    handleCallback()
  }, [searchParams, router, params.lang])

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
      
      toast.success('Welcome to Recipe2!')
      router.push(`/${params.lang}/my-cookbook`)
      router.refresh()
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to update username')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-svh items-center justify-center">
      <Dialog open={showUsernameDialog} onOpenChange={setShowUsernameDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Choose your username</DialogTitle>
            <DialogDescription>
              Please choose a unique username for your account
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
              />
              {error && <p className="text-sm text-red-500">{error}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleUsernameSubmit} disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save username'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <div className="animate-pulse text-center text-muted-foreground">
        Authenticating...
      </div>
    </div>
  )
} 