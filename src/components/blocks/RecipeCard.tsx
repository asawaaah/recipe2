import { Clock, Users } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface RecipeCardProps {
  id: string
  title: string
  description: string
  cookingTime?: number | null
  servings?: number | null
  imageUrl?: string | null
}

export function RecipeCard({
  id,
  title,
  description,
  cookingTime,
  servings,
  imageUrl,
}: RecipeCardProps) {
  return (
    <Link href={`/recipes/${id}`}>
      <Card className="h-full overflow-hidden transition-all hover:shadow-lg">
        {imageUrl && (
          <div className="relative aspect-video w-full">
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        )}
        <CardHeader className="px-2">
          <CardTitle className="line-clamp-2">{title}</CardTitle>
          <CardDescription className="line-clamp-2">{description}</CardDescription>
        </CardHeader>
        <CardContent className="p-2 pb-4 pt-0">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {cookingTime && (
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{cookingTime} min</span>
              </div>
            )}
            {servings && (
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{servings} servings</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
} 