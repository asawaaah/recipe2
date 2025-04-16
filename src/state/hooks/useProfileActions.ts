"use client"

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase'
import { userKeys } from '../queries/users'
import { toast } from 'sonner'

export type ProfileUpdateData = {
  username?: string
  display_name?: string
  bio?: string
  avatar_url?: string
}

export function useProfileActions() {
  const queryClient = useQueryClient()
  const supabase = createClient()
  
  // Update profile
  const updateProfileMutation = useMutation({
    mutationFn: async (profileData: ProfileUpdateData) => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('You must be logged in to update your profile')
      
      // Check if username is taken when updating username
      if (profileData.username) {
        const { data: existingUser } = await supabase
          .from('users')
          .select('id')
          .eq('username', profileData.username)
          .neq('id', user.id)
          .single()
          
        if (existingUser) {
          throw new Error('Username already taken')
        }
      }
      
      // Update profile
      const { data, error } = await supabase
        .from('users')
        .update(profileData)
        .eq('id', user.id)
        .select()
        .single()
        
      if (error) throw error
      return data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: userKeys.profile() })
      queryClient.invalidateQueries({ queryKey: userKeys.detail(data.id) })
      toast.success('Profile updated successfully!')
    },
    onError: (error: Error) => {
      toast.error(`Failed to update profile: ${error.message}`)
    }
  })
  
  // Upload avatar
  const uploadAvatarMutation = useMutation({
    mutationFn: async (file: File) => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('You must be logged in to upload an avatar')
      
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}-avatar.${fileExt}`
      
      // Upload to Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true })
        
      if (uploadError) throw uploadError
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName)
        
      // Update user profile with avatar URL
      const { data, error } = await supabase
        .from('users')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id)
        .select()
        .single()
        
      if (error) throw error
      return data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: userKeys.profile() })
      queryClient.invalidateQueries({ queryKey: userKeys.detail(data.id) })
      toast.success('Avatar uploaded successfully!')
    },
    onError: (error: Error) => {
      toast.error(`Failed to upload avatar: ${error.message}`)
    }
  })
  
  return {
    updateProfile: updateProfileMutation.mutate,
    isUpdatingProfile: updateProfileMutation.isPending,
    updateProfileError: updateProfileMutation.error,
    
    uploadAvatar: uploadAvatarMutation.mutate,
    isUploadingAvatar: uploadAvatarMutation.isPending,
    uploadAvatarError: uploadAvatarMutation.error,
  }
} 