import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export async function uploadRecipeImage(file: File): Promise<string | null> {
  const supabase = createClientComponentClient()
  
  // Generate a unique filename
  const fileExt = file.name.split('.').pop()
  const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`
  
  // Upload the file to Supabase storage
  const { data, error } = await supabase.storage
    .from('recipe-images')
    .upload(fileName, file)

  if (error) {
    console.error('Upload error:', error)
    return null
  }

  // Get the public URL
  const { data: { publicUrl } } = supabase.storage
    .from('recipe-images')
    .getPublicUrl(fileName)

  return publicUrl
} 