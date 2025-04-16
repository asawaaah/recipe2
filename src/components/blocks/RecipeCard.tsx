import { Clock, Users } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"

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
  className?: string
  listView?: boolean
}

export function RecipeCard({
  id,
  title,
  description,
  cookingTime,
  servings,
  imageUrl,
  className,
  listView = false,
}: RecipeCardProps) {
  // For grid view, we use the original layout
  if (!listView) {
    return (
      <Link href={`/recipes/${id}`}>
        <Card className={cn(
          "h-full overflow-hidden transition-all hover:shadow-lg",
          className
        )}>
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
          <div className="flex flex-col">
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
          </div>
        </Card>
      </Link>
    )
  }
  
  // For list view, we use a different layout with image on the right
  return (
    <Link href={`/recipes/${id}`}>
      <Card className={cn(
        "overflow-hidden transition-all hover:shadow-lg h-24 flex flex-row items-center justify-between",
        className
      )}>
        <div className="flex-1 h-full py-2">
          <CardHeader className="py-0 px-2 space-y-1">
            <CardTitle className="text-lg line-clamp-1">{title}</CardTitle>
            <CardDescription className="line-clamp-1">{description}</CardDescription>
          </CardHeader>
          <CardContent className="p-2 py-0">
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
        </div>
        {imageUrl ? (
          <div className="relative h-full w-24 overflow-hidden flex-shrink-0">
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="object-cover"
              sizes="96px"
            />
          </div>
        ) : (
          // Empty placeholder to maintain consistent padding when no image
          <div className="w-6 h-full flex-shrink-0"></div>
        )}
      </Card>
    </Link>
  )
} 