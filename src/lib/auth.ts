import { createClient } from '@/lib/supabase'
import { SignInInput, SignUpInput } from './validators/auth'

export async function signUp({ email, password, username }: SignUpInput) {
  const supabase = createClient()
  
  const { data: existingUser } = await supabase
    .from('users')
    .select('username')
    .eq('username', username)
    .single()

  if (existingUser) {
    throw new Error('Username already taken')
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username,
        display_name: username
      }
    }
  })

  if (error) {
    throw error
  }

  return data
}

export async function signIn({ emailOrUsername, password }: SignInInput) {
  const supabase = createClient()
  
  // If input looks like an email, use it directly
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

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  if (error) {
    throw error
  }

  return data
}

export async function signInWithGoogle() {
  const supabase = createClient()
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`
    }
  })

  if (error) {
    throw error
  }

  return data
}

export async function signOut() {
  const supabase = createClient()
  const { error } = await supabase.auth.signOut()
  
  if (error) {
    throw error
  }
}

export async function getSession() {
  const supabase = createClient()
  const { data: { session }, error } = await supabase.auth.getSession()
  
  if (error) {
    throw error
  }
  
  return session
}

export async function updateUsername(userId: string, username: string) {
  const supabase = createClient()
  
  const { data: existingUser } = await supabase
    .from('users')
    .select('username')
    .eq('username', username)
    .single()

  if (existingUser) {
    throw new Error('Username already taken')
  }

  const { error } = await supabase
    .from('users')
    .update({ username })
    .eq('id', userId)

  if (error) {
    throw error
  }
} 