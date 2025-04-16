'use client'

import { useRecipeForm } from '../hooks/useRecipeForm'
import { useProfileForm } from '../hooks/useProfileForm'
import { useAuth } from '../hooks/useAuth'
import { useState } from 'react'

/**
 * Example of using the recipe form hook
 */
export function RecipeFormExample() {
  const { user } = useAuth()
  const {
    formData,
    activeStep,
    currentStepName,
    steps,
    errors,
    isLoading,
    updateBasicInfo,
    addIngredient,
    removeIngredient,
    addInstruction,
    removeInstruction,
    nextStep,
    prevStep,
    goToStep,
    submitForm,
    clearForm
  } = useRecipeForm()
  
  const [ingredient, setIngredient] = useState({ name: '', amount: '', unit: '' })
  const [instruction, setInstruction] = useState({ step_number: 1, description: '' })
  
  const handleAddIngredient = () => {
    addIngredient(ingredient)
    setIngredient({ name: '', amount: '', unit: '' })
  }
  
  const handleAddInstruction = () => {
    addInstruction(instruction)
    setInstruction({ step_number: (formData.instructions?.length || 0) + 1, description: '' })
  }
  
  const renderStep = () => {
    switch (currentStepName) {
      case 'basics':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Basic Information</h3>
            
            <div>
              <label className="block mb-1">Title</label>
              <input 
                type="text" 
                value={formData.title} 
                onChange={(e) => updateBasicInfo({ title: e.target.value })}
                className="w-full p-2 border rounded"
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
            </div>
            
            <div>
              <label className="block mb-1">Description</label>
              <textarea 
                value={formData.description} 
                onChange={(e) => updateBasicInfo({ description: e.target.value })}
                className="w-full p-2 border rounded"
                rows={4}
              />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1">Cooking Time (minutes)</label>
                <input 
                  type="number" 
                  value={formData.cooking_time} 
                  onChange={(e) => updateBasicInfo({ cooking_time: Number(e.target.value) })}
                  className="w-full p-2 border rounded"
                />
              </div>
              
              <div>
                <label className="block mb-1">Servings</label>
                <input 
                  type="number" 
                  value={formData.servings} 
                  onChange={(e) => updateBasicInfo({ servings: Number(e.target.value) })}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
          </div>
        )
      
      case 'ingredients':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Ingredients</h3>
            
            {errors.ingredients && <p className="text-red-500 text-sm">{errors.ingredients}</p>}
            
            <div className="space-y-2">
              {formData.ingredients?.map((ing, index) => (
                <div key={ing.id} className="flex items-center space-x-2 p-2 border rounded">
                  <span className="flex-grow">{ing.amount} {ing.unit} {ing.name}</span>
                  <button 
                    onClick={() => removeIngredient(index)}
                    className="p-1 text-red-500"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              <input 
                placeholder="Name" 
                value={ingredient.name} 
                onChange={(e) => setIngredient({ ...ingredient, name: e.target.value })}
                className="p-2 border rounded"
              />
              <input 
                placeholder="Amount" 
                value={ingredient.amount} 
                onChange={(e) => setIngredient({ ...ingredient, amount: e.target.value })}
                className="p-2 border rounded"
              />
              <input 
                placeholder="Unit" 
                value={ingredient.unit} 
                onChange={(e) => setIngredient({ ...ingredient, unit: e.target.value })}
                className="p-2 border rounded"
              />
            </div>
            
            <button 
              onClick={handleAddIngredient}
              className="p-2 bg-blue-500 text-white rounded"
              disabled={!ingredient.name || !ingredient.amount}
            >
              Add Ingredient
            </button>
          </div>
        )
      
      case 'instructions':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Instructions</h3>
            
            {errors.instructions && <p className="text-red-500 text-sm">{errors.instructions}</p>}
            
            <div className="space-y-2">
              {formData.instructions?.map((instr, index) => (
                <div key={instr.id} className="flex items-start space-x-2 p-2 border rounded">
                  <span className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full">
                    {instr.step_number}
                  </span>
                  <p className="flex-grow">{instr.description}</p>
                  <button 
                    onClick={() => removeInstruction(index)}
                    className="p-1 text-red-500"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
            
            <div className="space-y-2">
              <textarea 
                placeholder="Instruction step" 
                value={instruction.description} 
                onChange={(e) => setInstruction({ ...instruction, description: e.target.value })}
                className="w-full p-2 border rounded"
                rows={3}
              />
            </div>
            
            <button 
              onClick={handleAddInstruction}
              className="p-2 bg-blue-500 text-white rounded"
              disabled={!instruction.description}
            >
              Add Instruction
            </button>
          </div>
        )
        
      case 'image':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Recipe Image</h3>
            
            <div>
              <label className="block mb-1">Image URL</label>
              <input 
                type="text" 
                value={formData.image_url} 
                onChange={(e) => updateBasicInfo({ image_url: e.target.value })}
                className="w-full p-2 border rounded"
                placeholder="https://example.com/image.jpg"
              />
            </div>
            
            {formData.image_url && (
              <div className="mt-4">
                <p className="mb-2">Preview:</p>
                <img 
                  src={formData.image_url} 
                  alt="Recipe preview" 
                  className="w-full max-w-md rounded-lg shadow-md"
                  onError={(e) => e.currentTarget.src = 'https://via.placeholder.com/400x300?text=Invalid+Image+URL'}
                />
              </div>
            )}
          </div>
        )
        
      case 'review':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Review Your Recipe</h3>
            
            <h2 className="text-xl font-bold">{formData.title}</h2>
            <p className="italic">{formData.description}</p>
            
            <div className="flex space-x-4 text-sm text-gray-600">
              <p>Cooking time: {formData.cooking_time} minutes</p>
              <p>Servings: {formData.servings}</p>
            </div>
            
            <h4 className="font-medium mt-4">Ingredients:</h4>
            <ul className="list-disc pl-5">
              {formData.ingredients?.map(ing => (
                <li key={ing.id}>{ing.amount} {ing.unit} {ing.name}</li>
              ))}
            </ul>
            
            <h4 className="font-medium mt-4">Instructions:</h4>
            <ol className="list-decimal pl-5">
              {formData.instructions?.map(instr => (
                <li key={instr.id} className="mb-2">{instr.description}</li>
              ))}
            </ol>
            
            {formData.image_url && (
              <img 
                src={formData.image_url} 
                alt="Recipe" 
                className="mt-4 w-full max-w-md rounded-lg shadow-md"
                onError={(e) => e.currentTarget.src = 'https://via.placeholder.com/400x300?text=Invalid+Image+URL'}
              />
            )}
          </div>
        )
        
      default:
        return null
    }
  }
  
  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Multi-Step Recipe Form</h2>
      
      <div className="mb-6 flex justify-between">
        {steps.map((step: string, index: number) => (
          <button
            key={step}
            className={`px-4 py-2 rounded-full ${
              activeStep === index ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
            onClick={() => goToStep(index)}
          >
            {step}
          </button>
        ))}
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        {renderStep()}
      </div>
      
      <div className="flex justify-between">
        <button
          onClick={prevStep}
          disabled={activeStep === 0}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Previous
        </button>
        
        {activeStep === steps.length - 1 ? (
          <button
            onClick={() => user?.id && submitForm(user.id)}
            disabled={isLoading}
            className="px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50"
          >
            {isLoading ? 'Saving...' : 'Save Recipe'}
          </button>
        ) : (
          <button
            onClick={nextStep}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Next
          </button>
        )}
      </div>
      
      <div className="mt-4">
        <button
          onClick={clearForm}
          className="px-4 py-2 text-red-500 border border-red-500 rounded"
        >
          Reset Form
        </button>
      </div>
    </div>
  )
}

/**
 * Example of using the profile form hook
 */
export function ProfileFormExample() {
  const {
    formData,
    errors,
    isLoading,
    updateField,
    handleAvatarChange,
    submitForm
  } = useProfileForm()
  
  // File input ref
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    handleAvatarChange(file)
  }
  
  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6">Profile Editor</h2>
      
      <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
        <div className="text-center mb-4">
          {formData.avatar_url ? (
            <img 
              src={formData.avatar_url} 
              alt="Avatar" 
              className="w-24 h-24 rounded-full mx-auto"
            />
          ) : (
            <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto flex items-center justify-center">
              <span className="text-2xl text-gray-500">?</span>
            </div>
          )}
          
          <label className="block mt-2 cursor-pointer text-blue-500">
            Change Avatar
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={handleFileSelect}
            />
          </label>
        </div>
        
        <div>
          <label className="block mb-1">Username</label>
          <input 
            type="text" 
            value={formData.username} 
            onChange={(e) => updateField('username', e.target.value)}
            className="w-full p-2 border rounded"
          />
          {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
        </div>
        
        <div>
          <label className="block mb-1">Display Name</label>
          <input 
            type="text" 
            value={formData.display_name || ''} 
            onChange={(e) => updateField('display_name', e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        
        <div>
          <label className="block mb-1">Bio</label>
          <textarea 
            value={formData.bio || ''} 
            onChange={(e) => updateField('bio', e.target.value)}
            className="w-full p-2 border rounded"
            rows={4}
          />
          {errors.bio && <p className="text-red-500 text-sm mt-1">{errors.bio}</p>}
        </div>
        
        <button
          onClick={() => submitForm()}
          disabled={isLoading}
          className="w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
        >
          {isLoading ? 'Saving...' : 'Save Profile'}
        </button>
      </div>
    </div>
  )
} 