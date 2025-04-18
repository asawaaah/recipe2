import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { createClient } from "@/lib/supabase"
import { useTranslation } from "@/components/i18n/TranslationContext"

// Types
type CreateRecipeData = {
  title: string
  description: string
  handle: string
  image_url?: string
  cooking_time?: number
  servings?: number
  ingredients: { name: string; amount: number | string; unit: string }[]
  instructions: { step_number: number; description: string }[]
  tags?: string[]
}

type UpdateRecipeData = Partial<CreateRecipeData> & { id: string }

// Query keys
export const recipeKeys = {
  all: ['recipes'] as const,
  lists: () => [...recipeKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...recipeKeys.lists(), filters] as const,
  details: () => [...recipeKeys.all, 'detail'] as const,
  detail: (id: string) => [...recipeKeys.details(), id] as const,
  userRecipes: (userId?: string, options?: Record<string, any>) => [...recipeKeys.lists(), { userId, ...options }] as const,
}

// Query Hooks
export function useRecipes(filters: Record<string, any> = {}) {
  const supabase = createClient()

  return useQuery({
    queryKey: recipeKeys.list(filters),
    queryFn: async () => {
      // Extract locale from filters but don't use it for filtering the database query
      const { locale, ...dbFilters } = filters
      
      let query = supabase
        .from("recipes")
        .select(`
          *,
          user:users!recipes_user_id_fkey(
            id, username
          ),
          translations:recipe_translations(*)
        `)
        
      // Apply filters dynamically - but only use dbFilters, not including locale
      Object.entries(dbFilters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          // @ts-ignore - dynamic filtering
          query = query.eq(key, value)
        }
      })
      
      const { data, error } = await query.order("created_at", { ascending: false })
      
      if (error) throw error
      
      // If locale is provided, apply translations
      if (locale && typeof locale === 'string') {
        return data.map(recipe => {
          if (recipe.translations && Array.isArray(recipe.translations)) {
            const translation = recipe.translations.find((t: any) => t.locale === locale);
            
            if (translation) {
              return {
                ...recipe,
                title: translation.title,
                description: translation.description,
                handle: translation.handle || recipe.handle
              };
            }
          }
          return recipe;
        });
      }
      
      return data
    },
  })
}

export function useUserRecipes(userId: string | undefined, options: Record<string, any> = {}) {
  const supabase = createClient()

  return useQuery({
    queryKey: recipeKeys.userRecipes(userId, options),
    queryFn: async () => {
      if (!userId) return []
      
      // Extract locale from options but don't use it for filtering
      const { locale, ...dbFilters } = options
      
      let query = supabase
        .from("recipes")
        .select(`
          *,
          user:users!recipes_user_id_fkey(
            id, username
          ),
          translations:recipe_translations(*)
        `)
        .eq("user_id", userId)
      
      // Apply any additional filters
      Object.entries(dbFilters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          // @ts-ignore - dynamic filtering
          query = query.eq(key, value)
        }
      })
      
      const { data, error } = await query.order("created_at", { ascending: false })
      
      if (error) throw error
      
      // If locale is provided, apply translations
      if (locale && typeof locale === 'string') {
        return data.map(recipe => {
          if (recipe.translations && Array.isArray(recipe.translations)) {
            const translation = recipe.translations.find((t: any) => t.locale === locale);
            
            if (translation) {
              return {
                ...recipe,
                title: translation.title,
                description: translation.description,
                handle: translation.handle || recipe.handle
              };
            }
          }
          return recipe;
        });
      }
      
      return data
    },
    enabled: !!userId,
  })
}

export function useRecipe(recipeId: string | undefined) {
  const supabase = createClient()

  return useQuery({
    queryKey: recipeKeys.detail(recipeId || ''),
    queryFn: async () => {
      if (!recipeId) return null
      
      try {
        const { data, error } = await supabase
          .from("recipes")
          .select(`
            *,
            ingredients(*),
            instructions(*),
            user:users!recipes_user_id_fkey(
              id, username
            )
          `)
          .eq("id", recipeId)
          .single()
        
        if (error) {
          // Check if it's a "no rows returned" error (recipe not found)
          if (error.code === 'PGRST116' || error.message.includes('no rows')) {
            return null // Return null for not found instead of throwing
          }
          throw error
        }
        
        return data
      } catch (err) {
        console.error('Error fetching recipe by ID:', err)
        throw err
      }
    },
    enabled: !!recipeId,
  })
}

export function useRecipeByHandle(handle: string | undefined) {
  const supabase = createClient()
  const { locale } = useTranslation()
  
  return useQuery({
    queryKey: [...recipeKeys.detail(handle || ''), locale],
    queryFn: async () => {
      if (!handle) return null
      
      try {
        // Cas spécial: si on est en anglais, essayer de trouver directement le recipe par handle
        if (locale === 'en') {
          // Essayer d'abord de trouver la recette directement par handle anglais
          const { data: directData, error: directError } = await supabase
            .from("recipes")
            .select(`
              *,
              ingredients(*),
              instructions(*),
              user:users!recipes_user_id_fkey(
                id, username
              ),
              translations:recipe_translations(*)
            `)
            .eq("handle", handle)
            .maybeSingle()
          
          if (directData) {
            return directData
          }
          
          // Si on n'a pas trouvé directement, c'est peut-être un handle traduit
          // Essayons de trouver la traduction et d'utiliser son recipe_id
          const { data: translationData } = await supabase
            .from("recipe_translations")
            .select(`recipe_id`)
            .eq("handle", handle)
            .maybeSingle()
          
          if (translationData?.recipe_id) {
            // Maintenant qu'on a l'ID, récupérer la recette en anglais
            const { data, error } = await supabase
              .from("recipes")
              .select(`
                *,
                ingredients(*),
                instructions(*),
                user:users!recipes_user_id_fkey(
                  id, username
                ),
                translations:recipe_translations(*)
              `)
              .eq("id", translationData.recipe_id)
              .single()
            
            if (data) {
              return data
            }
          }
        }
        
        // Pour les autres langues, essayer de trouver une traduction spécifique
        const { data: translationData, error: translationError } = await supabase
          .from("recipe_translations")
          .select(`
            *,
            recipe:recipes(
              *,
              ingredients(*),
              instructions(*),
              user:users!recipes_user_id_fkey(
                id, username
              ),
              translations:recipe_translations(*)
            )
          `)
          .eq("handle", handle)
          .eq("locale", locale)
          .maybeSingle()
          
        // Si on a trouvé une traduction spécifique pour la locale actuelle
        if (translationData?.recipe) {
          console.log('Found recipe through translation for locale:', locale)
          return {
            ...translationData.recipe,
            title: translationData.title,
            description: translationData.description
          }
        }
        
        // Si pas de traduction spécifique, chercher par handle dans n'importe quelle langue
        const { data: anyTranslationData, error: anyTranslationError } = await supabase
          .from("recipe_translations")
          .select(`
            *,
            recipe:recipes(
              *,
              ingredients(*),
              instructions(*),
              user:users!recipes_user_id_fkey(
                id, username
              ),
              translations:recipe_translations(*)
            )
          `)
          .eq("handle", handle)
          .maybeSingle()
          
        // Si on a trouvé une traduction, appliquer celle pour la langue actuelle si disponible
        if (anyTranslationData?.recipe) {
          const recipe = anyTranslationData.recipe
          
          // Vérifier s'il y a une traduction pour la langue actuelle
          const currentLocaleTranslation = recipe.translations.find(
            (t: any) => t.locale === locale
          )
          
          if (currentLocaleTranslation) {
            // Utiliser la traduction dans la langue actuelle
            return {
              ...recipe,
              title: currentLocaleTranslation.title,
              description: currentLocaleTranslation.description
            }
          }
          
          // Sinon utiliser la traduction trouvée
          return {
            ...recipe,
            title: anyTranslationData.title,
            description: anyTranslationData.description
          }
        }
        
        // En dernier recours, essayer de trouver la recette directement par handle
        const { data, error } = await supabase
          .from("recipes")
          .select(`
            *,
            ingredients(*),
            instructions(*),
            user:users!recipes_user_id_fkey(
              id, username
            ),
            translations:recipe_translations(*)
          `)
          .eq("handle", handle)
          .single()
        
        if (error) {
          if (error.code === 'PGRST116' || error.message.includes('no rows')) {
            throw new Error(`Recipe with handle "${handle}" not found`)
          }
          throw error
        }
        
        if (!data) {
          throw new Error(`Recipe with handle "${handle}" not found`)
        }
        
        // Chercher une traduction dans la langue actuelle
        const localeTranslation = data.translations.find(
          (t: any) => t.locale === locale
        )
        
        if (localeTranslation) {
          return {
            ...data,
            title: localeTranslation.title,
            description: localeTranslation.description
          }
        }
        
        return data
      } catch (err) {
        // Loguer et relancer uniquement pour les erreurs inattendues
        if (err instanceof Error && 
            !err.message.includes('not found')) {
          console.error('Error fetching recipe by handle:', err)
        }
        throw err
      }
    },
    enabled: !!handle,
    retry: 1
  })
}

// Mutation Hooks
export function useCreateRecipe() {
  const queryClient = useQueryClient()
  const supabase = createClient()

  return useMutation({
    mutationFn: async (recipe: CreateRecipeData) => {
      const user = (await supabase.auth.getUser()).data.user
      if (!user) throw new Error("You must be logged in to create a recipe")

      // Insert recipe
      const { data: recipeData, error: recipeError } = await supabase
        .from("recipes")
        .insert({
          title: recipe.title,
          description: recipe.description,
          handle: recipe.handle,
          user_id: user.id,
          image_url: recipe.image_url,
          cooking_time: recipe.cooking_time,
          servings: recipe.servings,
        })
        .select()
        .single()

      if (recipeError) throw recipeError
      const recipeId = recipeData.id

      // Insert ingredients
      if (recipe.ingredients.length > 0) {
        const { error: ingredientsError } = await supabase
          .from("ingredients")
          .insert(
            recipe.ingredients.map(ingredient => ({
              ...ingredient,
              recipe_id: recipeId,
            }))
          )

        if (ingredientsError) throw ingredientsError
      }

      // Insert instructions
      if (recipe.instructions.length > 0) {
        const { error: instructionsError } = await supabase
          .from("instructions")
          .insert(
            recipe.instructions.map(instruction => ({
              ...instruction,
              recipe_id: recipeId,
            }))
          )

        if (instructionsError) throw instructionsError
      }

      // Insert tags if present
      if (recipe.tags && recipe.tags.length > 0) {
        // Get or create tags
        for (const tagName of recipe.tags) {
          // Check if tag exists
          const { data: existingTag } = await supabase
            .from("tags")
            .select("id")
            .eq("name", tagName)
            .single()

          let tagId = existingTag?.id

          // Create tag if it doesn't exist
          if (!tagId) {
            const { data: newTag, error: tagError } = await supabase
              .from("tags")
              .insert({ name: tagName })
              .select()
              .single()

            if (tagError) throw tagError
            tagId = newTag.id
          }

          // Create recipe-tag relationship
          const { error: relationError } = await supabase
            .from("recipe_tags")
            .insert({
              recipe_id: recipeId,
              tag_id: tagId,
            })

          if (relationError) throw relationError
        }
      }

      return recipeData
    },
    onSuccess: (data) => {
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: recipeKeys.lists() })
      queryClient.invalidateQueries({ 
        queryKey: recipeKeys.userRecipes(data.user_id)
      })
    },
  })
}

export function useUpdateRecipe() {
  const queryClient = useQueryClient()
  const supabase = createClient()

  return useMutation({
    mutationFn: async ({ id, ...recipe }: UpdateRecipeData) => {
      // Update recipe basic info
      const { data: recipeData, error: recipeError } = await supabase
        .from("recipes")
        .update({
          ...(recipe.title && { title: recipe.title }),
          ...(recipe.description && { description: recipe.description }),
          ...(recipe.handle && { handle: recipe.handle }),
          ...(recipe.image_url && { image_url: recipe.image_url }),
          ...(recipe.cooking_time && { cooking_time: recipe.cooking_time }),
          ...(recipe.servings && { servings: recipe.servings }),
        })
        .eq("id", id)
        .select()
        .single()

      if (recipeError) throw recipeError

      // If updating ingredients, delete existing and add new ones
      if (recipe.ingredients) {
        // Delete existing ingredients
        const { error: deleteError } = await supabase
          .from("ingredients")
          .delete()
          .eq("recipe_id", id)

        if (deleteError) throw deleteError

        // Add new ingredients
        if (recipe.ingredients.length > 0) {
          const { error: ingredientsError } = await supabase
            .from("ingredients")
            .insert(
              recipe.ingredients.map(ingredient => ({
                ...ingredient,
                recipe_id: id,
              }))
            )

          if (ingredientsError) throw ingredientsError
        }
      }

      // If updating instructions, delete existing and add new ones
      if (recipe.instructions) {
        // Delete existing instructions
        const { error: deleteError } = await supabase
          .from("instructions")
          .delete()
          .eq("recipe_id", id)

        if (deleteError) throw deleteError

        // Add new instructions
        if (recipe.instructions.length > 0) {
          const { error: instructionsError } = await supabase
            .from("instructions")
            .insert(
              recipe.instructions.map(instruction => ({
                ...instruction,
                recipe_id: id,
              }))
            )

          if (instructionsError) throw instructionsError
        }
      }

      return recipeData
    },
    onSuccess: (data) => {
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: recipeKeys.lists() })
      queryClient.invalidateQueries({ 
        queryKey: recipeKeys.userRecipes(data.user_id)
      })
      queryClient.invalidateQueries({ 
        queryKey: recipeKeys.detail(data.id)
      })
    },
  })
}

export function useDeleteRecipe() {
  const queryClient = useQueryClient()
  const supabase = createClient()

  return useMutation({
    mutationFn: async (recipeId: string) => {
      const { error } = await supabase
        .from("recipes")
        .delete()
        .eq("id", recipeId)

      if (error) throw error
      return recipeId
    },
    onSuccess: (_data, variables) => {
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: recipeKeys.lists() })
      queryClient.invalidateQueries({ 
        queryKey: recipeKeys.userRecipes()
      })
      queryClient.invalidateQueries({ 
        queryKey: recipeKeys.detail(variables)
      })
    },
  })
} 