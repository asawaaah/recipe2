import { useState } from 'react'
import { uploadRecipeImage } from '@/services/recipes/imageUploader'

interface ImageUploadProps {
  onImageUploaded: (url: string) => void
  currentImageUrl?: string
}

export function ImageUpload({ onImageUploaded, currentImageUrl }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState(currentImageUrl)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Show preview
    const objectUrl = URL.createObjectURL(file)
    setPreviewUrl(objectUrl)

    // Upload file
    setIsUploading(true)
    try {
      const imageUrl = await uploadRecipeImage(file)
      if (imageUrl) {
        onImageUploaded(imageUrl)
      }
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {previewUrl && (
        <div className="relative w-full aspect-video">
          <img
            src={previewUrl}
            alt="Recipe preview"
            className="object-cover w-full h-full rounded-lg"
          />
        </div>
      )}
      
      <label className="cursor-pointer inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          disabled={isUploading}
        />
        {isUploading ? 'Uploading...' : 'Upload Image'}
      </label>
    </div>
  )
} 