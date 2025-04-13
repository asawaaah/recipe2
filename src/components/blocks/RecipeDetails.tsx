import Image from 'next/image'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { Separator } from '@/components/ui/separator'
import { Clock, Users } from 'lucide-react'

interface Ingredient {
  id: string
  name: string
  amount: number
  unit: string
}

interface Instruction {
  id: string
  step_number: number
  description: string
}

interface User {
  id: string
  username: string
  avatar_url: string
}

interface Recipe {
  id: string
  title: string
  description: string
  image_url: string
  cooking_time: number
  servings: number
  ingredients: Ingredient[]
  instructions: Instruction[]
  users: User
}

interface RecipeDetailsProps {
  recipe: Recipe
}

export default function RecipeDetails({ recipe }: RecipeDetailsProps) {
  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header Section */}
      <div className="space-y-4 mb-8">
        <div className="flex items-center gap-4">
          <h1 className="text-4xl font-bold">{recipe.title}</h1>
          <div className="flex items-center gap-2 ml-auto">
            <Avatar className="h-8 w-8">
              <AvatarImage src={recipe.users.avatar_url} alt={recipe.users.username} />
              <AvatarFallback>{recipe.users.username[0]}</AvatarFallback>
            </Avatar>
            <span className="text-sm text-muted-foreground">by {recipe.users.username}</span>
          </div>
        </div>
        <p className="text-lg text-muted-foreground">{recipe.description}</p>
      </div>

      {/* Image and Quick Info */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <AspectRatio ratio={16 / 9} className="overflow-hidden rounded-lg mb-6">
            <Image
              src={recipe.image_url}
              alt={recipe.title}
              fill
              className="object-cover"
              priority
            />
          </AspectRatio>
          <div className="flex gap-4 justify-center">
            <Badge variant="secondary" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {recipe.cooking_time} minutes
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              {recipe.servings} servings
            </Badge>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Ingredients Section */}
        <Card>
          <CardHeader>
            <h2 className="text-2xl font-semibold">Ingredients</h2>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {recipe.ingredients.map((ingredient) => (
                <li key={ingredient.id} className="flex justify-between">
                  <span>{ingredient.name}</span>
                  <span className="text-muted-foreground">
                    {ingredient.amount} {ingredient.unit}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Instructions Section */}
        <Card>
          <CardHeader>
            <h2 className="text-2xl font-semibold">Instructions</h2>
          </CardHeader>
          <CardContent>
            <ol className="space-y-4">
              {recipe.instructions.map((instruction) => (
                <li key={instruction.id} className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                    {instruction.step_number}
                  </span>
                  <p>{instruction.description}</p>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 