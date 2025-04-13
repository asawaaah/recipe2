import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export interface User {
  id: string
  username: string
  email: string
  firstname?: string
  lastname?: string
}

export async function fetchUserById(userId: string): Promise<User | null> {
  console.log('Attempting to fetch user with ID:', userId)
  
  try {
    const supabase = createServerComponentClient({ cookies })
    
    console.log('Executing Supabase query for user...')
    const { data: user, error } = await supabase
      .from('users')
      .select('id, username, email, firstname, lastname')
      .eq('id', userId)
      .single()

    if (error) {
      console.error('Supabase error fetching user:', {
        error: error.message,
        details: error.details,
        hint: error.hint
      })
      return null
    }

    if (!user) {
      console.log('No user found with ID:', userId)
      return null
    }

    console.log('Successfully fetched user:', {
      id: user.id,
      username: user.username,
      hasEmail: !!user.email
    })

    return user
  } catch (e) {
    console.error('Unexpected error in fetchUserById:', e)
    return null
  }
} 