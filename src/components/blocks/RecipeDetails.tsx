import Image from 'next/image'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { Clock, Users, User } from 'lucide-react'
import { Recipe } from '@/services/recipes/types'

interface RecipeDetailsProps {
  recipe: Recipe
}

const RecipeDetails = ({ recipe }: RecipeDetailsProps) => {
  if (!recipe) return null

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Image and Quick Info */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="relative w-full">
            <AspectRatio ratio={16 / 9}>
              {recipe.image_url ? (
                <Image
                  src={recipe.image_url}
                  alt={recipe.title}
                  fill
                  className="rounded-lg object-cover"
                />
              ) : (
                <div className="h-full w-full rounded-lg bg-muted" />
              )}
            </AspectRatio>
          </div>
          <div className="flex gap-4 justify-center mt-6">
            {recipe.cooking_time && (
              <Badge variant="secondary" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {recipe.cooking_time} minutes
              </Badge>
            )}
            {recipe.servings && (
              <Badge variant="secondary" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                {recipe.servings} servings
              </Badge>
            )}
            {recipe.user && (
              <Badge variant="secondary" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <Link 
                  href={`/users/${recipe.user.username}`}
                  className="hover:text-primary transition-colors"
                >
                  {recipe.user.username}
                </Link>
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Ingredients Section */}
        <Card>
          <CardHeader>
            <h4 className="text-2xl font-semibold">Ingredients</h4>
          </CardHeader>
          <CardContent>
            <div className="mt-8">
              <ul className="mt-4 space-y-2">
                {recipe.ingredients?.map((ingredient) => (
                  <li key={ingredient.id} className="flex items-center gap-2">
                    <span>{ingredient.amount}</span>
                    <span>{ingredient.unit}</span>
                    <span>{ingredient.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Instructions Section */}
        <Card>
          <CardHeader>
            <h4 className="text-2xl font-semibold">Instructions</h4>
          </CardHeader>
          <CardContent>
            <div className="mt-8">
              <ol className="mt-4 space-y-4">
                {recipe.instructions?.map((instruction) => (
                  <li key={instruction.id} className="flex gap-4">
                    <span className="font-semibold">{instruction.step_number}.</span>
                    <p>{instruction.description}</p>
                  </li>
                ))}
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default RecipeDetails 