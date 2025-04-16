'use client'

import { SidebarLayout } from "@/components/layouts/SidebarLayout"
import { useState, useEffect } from "react"
import { useUser } from "@/state/hooks/useUser"
import { useRecipeForm } from "@/state/hooks/useRecipeForm"
import { useRecipe } from "@/state/hooks/useRecipes"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Plus, Trash } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { useRouter } from 'next/navigation'

interface EditRecipePageProps {
  params: {
    id: string
  }
}

export default function EditRecipePage({ params }: EditRecipePageProps) {
  const router = useRouter()
  const { profile } = useUser()
  const { data: recipeData, isLoading: isRecipeLoading, error: recipeError } = useRecipe(params.id)
  
  // Initialize form with the recipe data when it loads
  const {
    formData,
    activeStep,
    currentStepName,
    steps,
    errors,
    isLoading,
    updateBasicInfo,
    addIngredient,
    updateIngredient,
    removeIngredient,
    addInstruction,
    updateInstruction,
    removeInstruction,
    nextStep,
    prevStep,
    goToStep,
    submitForm,
    clearForm
  } = useRecipeForm(recipeData)
  
  // State for new ingredient and instruction inputs
  const [newIngredient, setNewIngredient] = useState({ name: '', amount: '', unit: '' })
  const [newInstruction, setNewInstruction] = useState({ 
    step_number: formData.instructions?.length ? formData.instructions.length + 1 : 1, 
    description: '' 
  })
  
  // Update step number when instructions change
  useEffect(() => {
    // Only update if the current step number doesn't match the array length + 1
    const newStepNumber = formData.instructions?.length ? formData.instructions.length + 1 : 1;
    if (newStepNumber !== newInstruction.step_number) {
      setNewInstruction(prev => ({
        ...prev,
        step_number: newStepNumber
      }));
    }
  }, [formData.instructions?.length]);
  
  // Handle adding a new ingredient
  const handleAddIngredient = () => {
    if (newIngredient.name && newIngredient.amount) {
      addIngredient({
        ...newIngredient,
        amount: newIngredient.amount // This will be converted to number in the addIngredient function
      })
      setNewIngredient({ name: '', amount: '', unit: '' })
    }
  }
  
  // Handle adding a new instruction
  const handleAddInstruction = () => {
    if (newInstruction.description) {
      addInstruction(newInstruction)
      setNewInstruction({ 
        step_number: formData.instructions?.length ? formData.instructions.length + 2 : 1, 
        description: '' 
      })
    }
  }
  
  // Map steps to tab values
  const getTabValue = (stepName: string) => stepName.toLowerCase()
  
  // Handle save result
  const handleSave = async () => {
    if (profile?.id) {
      await submitForm(profile.id)
    }
  }

  // Show loading state
  if (isRecipeLoading) {
    return (
      <SidebarLayout
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "My Cookbook", href: "/my-cookbook" },
          { label: "Edit Recipe", isCurrentPage: true }
        ]}
      >
        <div className="container max-w-4xl py-6 space-y-6">
          <Skeleton className="h-10 w-1/3" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-32 w-full" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
      </SidebarLayout>
    )
  }
  
  // Show error state
  if (recipeError) {
    return (
      <SidebarLayout
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "My Cookbook", href: "/my-cookbook" },
          { label: "Edit Recipe", isCurrentPage: true }
        ]}
      >
        <div className="container py-6">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Failed to load recipe data. Please try again later.
            </AlertDescription>
          </Alert>
          <Button className="mt-4" onClick={() => router.push('/my-cookbook')}>
            Return to My Cookbook
          </Button>
        </div>
      </SidebarLayout>
    )
  }
  
  return (
    <SidebarLayout
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "My Cookbook", href: "/my-cookbook" },
        { label: "Edit Recipe", isCurrentPage: true }
      ]}
    >
      <div className="container max-w-4xl py-6">
        <h1 className="text-3xl font-bold mb-6">Edit Recipe</h1>
        
        <Tabs 
          value={getTabValue(currentStepName)} 
          onValueChange={(value) => {
            const stepIndex = steps.findIndex(step => getTabValue(step) === value)
            if (stepIndex !== -1) goToStep(stepIndex)
          }}
        >
          <TabsList className="grid grid-cols-5 mb-6">
            {steps.map(step => (
              <TabsTrigger key={step} value={getTabValue(step)}>
                {step.charAt(0).toUpperCase() + step.slice(1)}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {/* Basics Tab */}
          <TabsContent value="basics">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Recipe Title</Label>
                  <Input 
                    id="title"
                    value={formData.title} 
                    onChange={(e) => updateBasicInfo({ title: e.target.value })}
                    placeholder="Enter recipe title"
                  />
                  {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description"
                    value={formData.description} 
                    onChange={(e) => updateBasicInfo({ description: e.target.value })}
                    placeholder="Describe your recipe"
                    rows={4}
                  />
                  {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cookingTime">Cooking Time (minutes)</Label>
                    <Input 
                      id="cookingTime"
                      type="number" 
                      value={formData.cooking_time || ''} 
                      onChange={(e) => updateBasicInfo({ cooking_time: Number(e.target.value) })}
                    />
                    {errors.cooking_time && <p className="text-sm text-destructive">{errors.cooking_time}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="servings">Servings</Label>
                    <Input 
                      id="servings"
                      type="number" 
                      value={formData.servings || ''} 
                      onChange={(e) => updateBasicInfo({ servings: Number(e.target.value) })}
                    />
                    {errors.servings && <p className="text-sm text-destructive">{errors.servings}</p>}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Ingredients Tab */}
          <TabsContent value="ingredients">
            <Card>
              <CardHeader>
                <CardTitle>Ingredients</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {errors.ingredients && <p className="text-sm text-destructive">{errors.ingredients}</p>}
                
                <div className="space-y-4">
                  {formData.ingredients?.map((ingredient, index) => (
                    <div key={ingredient.id} className="flex items-center space-x-2 p-3 border rounded-md">
                      <span className="flex-grow">{ingredient.amount} {ingredient.unit} {ingredient.name}</span>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => removeIngredient(index)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                
                <div className="grid grid-cols-5 gap-2">
                  <div className="col-span-2">
                    <Label htmlFor="ingredientName">Ingredient</Label>
                    <Input 
                      id="ingredientName"
                      value={newIngredient.name} 
                      onChange={(e) => setNewIngredient({ ...newIngredient, name: e.target.value })}
                      placeholder="e.g. Flour"
                    />
                  </div>
                  <div>
                    <Label htmlFor="ingredientAmount">Amount</Label>
                    <Input 
                      id="ingredientAmount"
                      value={newIngredient.amount} 
                      onChange={(e) => setNewIngredient({ ...newIngredient, amount: e.target.value })}
                      placeholder="e.g. 2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="ingredientUnit">Unit</Label>
                    <Input 
                      id="ingredientUnit"
                      value={newIngredient.unit} 
                      onChange={(e) => setNewIngredient({ ...newIngredient, unit: e.target.value })}
                      placeholder="e.g. cups"
                    />
                  </div>
                  <div className="flex items-end">
                    <Button onClick={handleAddIngredient}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Instructions Tab */}
          <TabsContent value="instructions">
            <Card>
              <CardHeader>
                <CardTitle>Instructions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {errors.instructions && <p className="text-sm text-destructive">{errors.instructions}</p>}
                
                <div className="space-y-4">
                  {formData.instructions?.map((instruction, index) => (
                    <div key={instruction.id} className="flex items-start space-x-2 p-3 border rounded-md">
                      <span className="font-bold">{instruction.step_number}.</span>
                      <span className="flex-grow">{instruction.description}</span>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => removeInstruction(index)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="instructionText">Step {newInstruction.step_number}</Label>
                  <div className="flex space-x-2">
                    <Textarea 
                      id="instructionText"
                      value={newInstruction.description} 
                      onChange={(e) => setNewInstruction({ ...newInstruction, description: e.target.value })}
                      placeholder="Describe this step"
                      className="flex-grow"
                    />
                    <Button onClick={handleAddInstruction} className="self-end">
                      <Plus className="h-4 w-4 mr-2" />
                      Add
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Image Tab */}
          <TabsContent value="image">
            <Card>
              <CardHeader>
                <CardTitle>Recipe Image</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="imageUrl">Image URL</Label>
                  <Input 
                    id="imageUrl"
                    value={formData.image_url || ''} 
                    onChange={(e) => updateBasicInfo({ image_url: e.target.value })}
                    placeholder="Enter URL for recipe image"
                  />
                </div>
                
                {formData.image_url && (
                  <div className="mt-4">
                    <p className="mb-2">Preview:</p>
                    <div className="relative aspect-video w-full max-w-md rounded-lg overflow-hidden shadow-md">
                      <img 
                        src={formData.image_url} 
                        alt="Recipe preview" 
                        className="object-cover w-full h-full"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Invalid+Image+URL'
                        }}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Review Tab */}
          <TabsContent value="review">
            <Card>
              <CardHeader>
                <CardTitle>Review Your Recipe</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold">{formData.title}</h2>
                  <p className="text-muted-foreground mt-2">{formData.description}</p>
                </div>
                
                <div className="flex flex-wrap gap-4">
                  {formData.cooking_time && (
                    <div className="text-sm text-muted-foreground">
                      <span className="font-medium">Cooking time:</span> {formData.cooking_time} minutes
                    </div>
                  )}
                  
                  {formData.servings && (
                    <div className="text-sm text-muted-foreground">
                      <span className="font-medium">Servings:</span> {formData.servings}
                    </div>
                  )}
                </div>
                
                {formData.image_url && (
                  <div className="relative aspect-video w-full max-w-md rounded-lg overflow-hidden shadow-md">
                    <img 
                      src={formData.image_url} 
                      alt="Recipe" 
                      className="object-cover w-full h-full"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Invalid+Image+URL'
                      }}
                    />
                  </div>
                )}
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Ingredients:</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {formData.ingredients?.map(ing => (
                        <li key={ing.id}>{ing.amount} {ing.unit} {ing.name}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Instructions:</h3>
                    <ol className="list-decimal pl-5 space-y-3">
                      {formData.instructions?.map(instr => (
                        <li key={instr.id}>{instr.description}</li>
                      ))}
                    </ol>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={activeStep === 0}
          >
            Previous
          </Button>
          
          <div className="space-x-2">
            <Button
              variant="outline"
              onClick={() => router.push('/my-cookbook')}
            >
              Cancel
            </Button>
            
            {activeStep === steps.length - 1 ? (
              <Button
                onClick={handleSave}
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Update Recipe
              </Button>
            ) : (
              <Button onClick={nextStep}>
                Next
              </Button>
            )}
          </div>
        </div>
      </div>
    </SidebarLayout>
  )
} 