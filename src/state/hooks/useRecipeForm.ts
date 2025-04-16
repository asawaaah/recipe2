'use client'

import { useState, useEffect } from 'react'
import { useRecipeActions } from './useRecipeActions'
import { useRouter } from 'next/navigation'
import { Recipe, Ingredient, Instruction, RecipeFormStep } from '@/types/recipe'
import { STORAGE_KEYS } from '../utils/storage'
import { useDraft } from './useDraft'
import { toast } from 'sonner'

export function useRecipeForm(initialData?: Partial<Recipe>) {
  const router = useRouter()
  const { createRecipe, updateRecipe, isCreating, isUpdating } = useRecipeActions()
  
  // Form steps
  const [activeStep, setActiveStep] = useState<number>(0)
  const steps: RecipeFormStep[] = ['basics', 'ingredients', 'instructions', 'image', 'review']
  
  // Use draft to persist form data with localStorage
  const { draft: formData, updateDraft: setFormData, clearDraft } = useDraft<Partial<Recipe>>(
    STORAGE_KEYS.DRAFT_RECIPE,
    {
      title: initialData?.title || '',
      description: initialData?.description || '',
      cooking_time: initialData?.cooking_time || 30,
      servings: initialData?.servings || 2,
      image_url: initialData?.image_url || '',
      ingredients: initialData?.ingredients || [],
      instructions: initialData?.instructions || [],
      tags: initialData?.tags || []
    }
  )
  
  // Load initial data when editing an existing recipe
  useEffect(() => {
    if (initialData?.id && Object.keys(initialData).length > 0) {
      // Only update if the data has actually changed, to prevent infinite update cycle
      if (formData.id !== initialData.id) {
        setFormData({
          ...initialData,
          ingredients: initialData.ingredients || [],
          instructions: initialData.instructions || [],
          tags: initialData.tags || []
        });
      }
    }
  }, [initialData]);
  
  // Validation state
  const [errors, setErrors] = useState<Record<string, string>>({})
  
  // Handler functions
  const updateBasicInfo = (data: Partial<Recipe>) => {
    setFormData(prev => ({ ...prev, ...data }))
  }
  
  // Ingredients handlers
  const addIngredient = (ingredient: Omit<Ingredient, 'id' | 'recipe_id'> | { name: string, amount: string | number, unit: string }) => {
    setFormData(prev => ({
      ...prev,
      ingredients: [...(prev.ingredients || []), {
        id: `temp-${Date.now()}`,
        recipe_id: initialData?.id || 'draft',
        ...ingredient,
        amount: typeof ingredient.amount === 'string' ? parseFloat(ingredient.amount) || 0 : ingredient.amount
      }]
    }))
  }
  
  const updateIngredient = (index: number, ingredient: Partial<Ingredient>) => {
    setFormData(prev => {
      const ingredients = [...(prev.ingredients || [])]
      ingredients[index] = { ...ingredients[index], ...ingredient }
      return { ...prev, ingredients }
    })
  }
  
  const removeIngredient = (index: number) => {
    setFormData(prev => {
      const ingredients = [...(prev.ingredients || [])]
      ingredients.splice(index, 1)
      return { ...prev, ingredients }
    })
  }
  
  // Instructions handlers
  const addInstruction = (instruction: Omit<Instruction, 'id' | 'recipe_id'>) => {
    setFormData(prev => ({
      ...prev,
      instructions: [...(prev.instructions || []), {
        id: `temp-${Date.now()}`,
        recipe_id: initialData?.id || 'draft',
        ...instruction
      }]
    }))
  }
  
  const updateInstruction = (index: number, instruction: Partial<Instruction>) => {
    setFormData(prev => {
      const instructions = [...(prev.instructions || [])]
      instructions[index] = { ...instructions[index], ...instruction }
      return { ...prev, instructions }
    })
  }
  
  const removeInstruction = (index: number) => {
    setFormData(prev => {
      const instructions = [...(prev.instructions || [])]
      instructions.splice(index, 1)
      // Reorder step numbers
      instructions.forEach((instr, idx) => {
        instr.step_number = idx + 1
      })
      return { ...prev, instructions }
    })
  }
  
  // Tags handlers
  const addTag = (tag: string) => {
    setFormData(prev => {
      const existingTags = prev.tags || []
      if (!existingTags.includes(tag)) {
        return {
          ...prev,
          tags: [...existingTags, tag]
        }
      }
      return prev
    })
  }
  
  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: (prev.tags || []).filter(t => t !== tag)
    }))
  }
  
  // Step navigation
  const nextStep = () => {
    if (validateCurrentStep()) {
      setActiveStep(prev => Math.min(prev + 1, steps.length - 1))
    }
  }
  
  const prevStep = () => {
    setActiveStep(prev => Math.max(prev - 1, 0))
  }
  
  const goToStep = (step: number) => {
    if (step >= 0 && step < steps.length) {
      setActiveStep(step)
    }
  }
  
  // Validation functions
  const validateCurrentStep = () => {
    const currentStep = steps[activeStep]
    const newErrors: Record<string, string> = {}
    
    if (currentStep === 'basics') {
      if (!formData.title?.trim()) {
        newErrors.title = 'Title is required'
      }
      if (!formData.description?.trim()) {
        newErrors.description = 'Description is required'
      }
      if (formData.cooking_time && formData.cooking_time < 0) {
        newErrors.cooking_time = 'Cooking time cannot be negative'
      }
      if (formData.servings && formData.servings <= 0) {
        newErrors.servings = 'Servings must be greater than zero'
      }
    } else if (currentStep === 'ingredients') {
      if (!formData.ingredients?.length) {
        newErrors.ingredients = 'At least one ingredient is required'
      }
    } else if (currentStep === 'instructions') {
      if (!formData.instructions?.length) {
        newErrors.instructions = 'At least one instruction is required'
      }
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  // Form submission
  const submitForm = async (userId: string) => {
    try {
      // Validate all steps before submitting
      for (let i = 0; i < steps.length; i++) {
        setActiveStep(i)
        if (!validateCurrentStep()) return
      }
      
      // Auto-generate a handle if not provided
      const handle = formData.handle || formData.title?.toLowerCase().replace(/\s+/g, '-') || ''
      
      // Clean and prepare the data
      const cleanedData = {
        title: formData.title || '',
        description: formData.description || '',
        handle,
        user_id: userId,
        cooking_time: formData.cooking_time,
        servings: formData.servings,
        image_url: formData.image_url,
        // Clean up ingredients, removing temporary IDs
        ingredients: formData.ingredients?.map(ingredient => ({
          name: ingredient.name,
          amount: ingredient.amount,
          unit: ingredient.unit
        })) || [],
        // Clean up instructions, removing temporary IDs
        instructions: formData.instructions?.map(instruction => ({
          step_number: instruction.step_number,
          description: instruction.description
        })) || [],
        tags: formData.tags
      }
      
      // Submit the data
      if (initialData?.id) {
        await updateRecipe({ id: initialData.id, ...cleanedData })
      } else {
        await createRecipe(cleanedData)
      }
      
      // Clear draft after successful submission
      clearDraft()
      
      // Navigate to the recipe or my cookbook
      router.push('/my-cookbook')
    } catch (error) {
      console.error('Error submitting recipe:', error)
      toast.error('Failed to save recipe. Please try again.')
    }
  }
  
  return {
    // State
    formData,
    activeStep,
    currentStepName: steps[activeStep],
    steps,
    errors,
    isLoading: isCreating || isUpdating,
    
    // Basic info handlers
    updateBasicInfo,
    
    // Ingredient handlers
    addIngredient,
    updateIngredient,
    removeIngredient,
    
    // Instruction handlers
    addInstruction,
    updateInstruction,
    removeInstruction,
    
    // Tag handlers
    addTag,
    removeTag,
    
    // Navigation
    nextStep,
    prevStep,
    goToStep,
    
    // Submit
    submitForm,
    clearForm: clearDraft
  }
} 