import { SidebarLayout } from "@/components/layouts/SidebarLayout"
import { RecipeCard } from "@/components/blocks/RecipeCard"

// Sample recipe data for development purposes
const placeholderRecipes = Array.from({ length: 15 }, (_, i) => ({
  id: `placeholder-${i + 1}`,
  title: `Chocolate Fondant ${i + 1}`,
  description:
    "A decadent chocolate fondant with a perfectly gooey center. This classic French dessert is pure chocolate heaven.",
  cookingTime: 15,
  servings: 1,
  imageUrl: "/images/recipes/chocolate-fondant.jpg",
}))

export default function Page() {
  return (
    <SidebarLayout
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "All Recipes", isCurrentPage: true }
      ]}
    >
      {/* Recipe grid - shows 2 cards per row on mobile, scaling up to 5 cards on larger screens */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {/* Map through recipe data to render individual recipe cards */}
        {placeholderRecipes.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            id={recipe.id}
            title={recipe.title}
            description={recipe.description}
            cookingTime={recipe.cookingTime}
            servings={recipe.servings}
            imageUrl={recipe.imageUrl}
          />
        ))}
      </div>
    </SidebarLayout>
  )
}
