import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { v4 as uuid } from 'uuid'
import type { GenerateRecipesInput } from '../services/recipeEngine'
import { generateSmartRecipes } from '../services/recipeEngine'
import type { Recipe } from '../types'

interface RecipeHistoryItem {
  id: string
  ingredients: string[]
  generatedAt: string
  recipeIds: string[]
}

interface RecipeState {
  generatedRecipes: Recipe[]
  lastIngredients: string[]
  history: RecipeHistoryItem[]
  loading: boolean
  generate: (input: GenerateRecipesInput) => void
  clearRecipes: () => void
}

export const useRecipeStore = create<RecipeState>()(
  persist(
    (set) => ({
      generatedRecipes: [],
      lastIngredients: [],
      history: [],
      loading: false,
      generate: (input) => {
        set({ loading: true })
        const recipes = generateSmartRecipes(input)

        set((state) => ({
          generatedRecipes: recipes,
          lastIngredients: input.ingredients,
          loading: false,
          history: [
            {
              id: uuid(),
              ingredients: input.ingredients,
              generatedAt: new Date().toISOString(),
              recipeIds: recipes.map((recipe) => recipe.id),
            },
            ...state.history,
          ].slice(0, 12),
        }))
      },
      clearRecipes: () => set({ generatedRecipes: [], lastIngredients: [] }),
    }),
    {
      name: 'ai-smart-recipes',
      partialize: (state) => ({
        history: state.history,
        lastIngredients: state.lastIngredients,
      }),
    },
  ),
)
