import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { createClient } from "@/lib/supabase"

type UpdateUserData = {
  username?: string
  display_name?: string
  avatar_url?: string
}

// Query keys
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...userKeys.lists(), filters] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
  profile: () => [...userKeys.all, 'profile'] as const,
}

// Query hooks
export function useUser(userId: string | undefined) {
  const supabase = createClient()
  
  return useQuery({
    queryKey: userKeys.detail(userId || ''),
    queryFn: async () => {
      if (!userId) return null
      
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single()
      
      if (error) throw error
      return data
    },
    enabled: !!userId,
  })
}

export function useCurrentUserProfile() {
  const supabase = createClient()
  
  return useQuery({
    queryKey: userKeys.profile(),
    queryFn: async () => {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return null
      
      // Get user profile
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single()
      
      if (error) throw error
      return data
    },
  })
}

// Mutation hooks
export function useUpdateUser() {
  const queryClient = useQueryClient()
  const supabase = createClient()

  return useMutation({
    mutationFn: async (userData: UpdateUserData) => {
      const user = (await supabase.auth.getUser()).data.user
      if (!user) throw new Error("You must be logged in to update your profile")
      
      // Check if username is taken (if updating username)
      if (userData.username) {
        const { data: existingUser } = await supabase
          .from("users")
          .select("id")
          .eq("username", userData.username)
          .neq("id", user.id)
          .single()
          
        if (existingUser) {
          throw new Error("Username already taken")
        }
      }
      
      // Update the user profile
      const { data, error } = await supabase
        .from("users")
        .update(userData)
        .eq("id", user.id)
        .select()
        .single()
        
      if (error) throw error
      return data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: userKeys.profile() })
      queryClient.invalidateQueries({ queryKey: userKeys.detail(data.id) })
    },
  })
}

export function useUploadAvatar() {
  const queryClient = useQueryClient()
  const supabase = createClient()

  return useMutation({
    mutationFn: async (file: File) => {
      const user = (await supabase.auth.getUser()).data.user
      if (!user) throw new Error("You must be logged in to upload an avatar")
      
      const fileExt = file.name.split(".").pop()
      const fileName = `${user.id}-avatar.${fileExt}`
      
      // Upload image
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(fileName, file, { upsert: true })
        
      if (uploadError) throw uploadError
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from("avatars")
        .getPublicUrl(fileName)
        
      // Update user profile with avatar URL
      const { data, error } = await supabase
        .from("users")
        .update({ avatar_url: publicUrl })
        .eq("id", user.id)
        .select()
        .single()
        
      if (error) throw error
      return data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: userKeys.profile() })
      queryClient.invalidateQueries({ queryKey: userKeys.detail(data.id) })
    },
  })
} 