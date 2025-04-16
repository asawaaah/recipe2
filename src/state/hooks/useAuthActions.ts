"use client"

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export type SignUpData = {
  email: string
  password: string
  username: string
}

export type SignInData = {
  emailOrUsername: string
  password: string
}

export function useAuthActions() {
  const router = useRouter()
  const supabase = createClient()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Sign up with email and password
  const signUp = async ({ email, password, username }: SignUpData) => {
    try {
      setIsLoading(true)
      setError(null)
      
      // Check if username is taken
      const { data: existingUser } = await supabase
        .from('users')
        .select('username')
        .eq('username', username)
        .single()
        
      if (existingUser) {
        throw new Error('Username already taken')
      }
      
      // Sign up with Supabase Auth
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            display_name: username
          }
        }
      })
      
      if (error) throw error
      
      toast.success('Sign up successful! Please check your email for verification.')
      router.push('/login')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during sign up')
      toast.error(err instanceof Error ? err.message : 'Sign up failed')
    } finally {
      setIsLoading(false)
    }
  }
  
  // Sign in with email/username and password
  const signIn = async ({ emailOrUsername, password }: SignInData) => {
    try {
      setIsLoading(true)
      setError(null)
      
      // Determine if input is email or username
      const isEmail = emailOrUsername.includes('@')
      let email = emailOrUsername
      
      // If username provided, look up the email
      if (!isEmail) {
        const { data: user } = await supabase
          .from('users')
          .select('email')
          .eq('username', emailOrUsername)
          .single()
          
        if (!user?.email) {
          throw new Error('User not found')
        }
        
        email = user.email
      }
      
      // Sign in with Supabase Auth
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) throw error
      
      toast.success('Sign in successful!')
      router.push('/my-cookbook')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during sign in')
      toast.error(err instanceof Error ? err.message : 'Sign in failed')
    } finally {
      setIsLoading(false)
    }
  }
  
  // Sign in with Google OAuth
  const signInWithGoogle = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })
      
      if (error) throw error
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during Google sign in')
      toast.error(err instanceof Error ? err.message : 'Google sign in failed')
    } finally {
      setIsLoading(false)
    }
  }
  
  // Sign out
  const signOut = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const { error } = await supabase.auth.signOut()
      
      if (error) throw error
      
      toast.success('Signed out successfully')
      router.push('/login')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during sign out')
      toast.error(err instanceof Error ? err.message : 'Sign out failed')
    } finally {
      setIsLoading(false)
    }
  }
  
  return {
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    isLoading,
    error,
  }
} 