'use client'

import { useState } from 'react'
import { useProfileActions } from './useProfileActions'
import { useAuth } from './useAuth'
import { User } from '@/types/recipe'
import { toast } from 'sonner'
import { useDraft } from './useDraft'
import { STORAGE_KEYS } from '../utils/storage'

export type ProfileFormData = {
  username: string
  display_name?: string
  bio?: string
  avatar_url?: string
}

export function useProfileForm(initialData?: Partial<User>) {
  const { user } = useAuth()
  const { updateProfile, uploadAvatar, isUpdatingProfile, isUploadingAvatar } = useProfileActions()
  
  // Use draft to persist form changes
  const { draft: formData, updateDraft: setFormData, clearDraft } = useDraft<ProfileFormData>(
    STORAGE_KEYS.DRAFT_PROFILE,
    {
      username: initialData?.username || (user as any)?.username || '',
      display_name: initialData?.display_name || (user as any)?.display_name || '',
      bio: initialData?.bio || '',
      avatar_url: initialData?.avatar_url || (user as any)?.avatar_url || ''
    }
  )
  
  // Validation state
  const [errors, setErrors] = useState<Record<string, string>>({})
  
  // File upload state
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  
  // Update form data
  const updateField = (field: keyof ProfileFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear error when field is edited
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }
  
  // Handle avatar selection
  const handleAvatarChange = (file: File | null) => {
    setAvatarFile(file)
    
    if (file) {
      // Preview the image
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result
        if (typeof result === 'string') {
          setFormData(prev => ({ ...prev, avatar_url: result }))
        }
      }
      reader.readAsDataURL(file)
    }
  }
  
  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required'
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters'
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = 'Username can only contain letters, numbers, and underscores'
    }
    
    if (formData.bio && formData.bio.length > 500) {
      newErrors.bio = 'Bio must be less than 500 characters'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  // Submit form
  const submitForm = async () => {
    try {
      if (!validateForm()) return
      
      let profileData = { ...formData }
      
      // Upload avatar if a new one is selected
      if (avatarFile) {
        const userData = await uploadAvatar(avatarFile) as unknown as { avatar_url: string }
        profileData.avatar_url = userData.avatar_url
      }
      
      // Update profile
      await updateProfile(profileData)
      
      // Clear draft after successful submission
      clearDraft()
      
      toast.success('Profile updated successfully!')
      return true
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Failed to update profile. Please try again.')
      return false
    }
  }
  
  return {
    formData,
    errors,
    isLoading: isUpdatingProfile || isUploadingAvatar,
    updateField,
    handleAvatarChange,
    avatarFile,
    submitForm,
    resetForm: clearDraft
  }
} 