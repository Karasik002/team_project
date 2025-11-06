import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { NutritionBreakdown, UserProfile } from '../types'

interface ProfileState {
  profile: UserProfile
  updateProfile: (profile: Partial<UserProfile>) => void
  toggleFavoriteRecipe: (recipeId: string) => void
  addCookedRecipe: (recipeId: string) => void
  updateMacroTarget: (macroTarget: Partial<NutritionBreakdown>) => void
}

const now = new Date().toISOString()

const defaultProfile: UserProfile = {
  id: 'user-001',
  name: 'Марина',
  avatar: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=96&q=80',
  allergies: ['nuts'],
  dietaryPreferences: ['omnivore'],
  favoriteCuisines: ['Середземноморська', 'Азійська'],
  dislikedIngredients: ['коріандр'],
  fitnessGoal: 'maintain',
  caloricTarget: 2000,
  macroTarget: {
    calories: 2000,
    protein: 110,
    carbs: 220,
    fats: 70,
  },
  favoriteRecipeIds: [],
  cookedRecipes: [],
  voiceAssistant: true,
  kitchenModeVoiceGuidance: true,
  createdAt: now,
  updatedAt: now,
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      profile: defaultProfile,
      updateProfile: (updates) =>
        set((state) => ({
          profile: {
            ...state.profile,
            ...updates,
            macroTarget: {
              ...state.profile.macroTarget,
              ...updates.macroTarget,
            },
            updatedAt: new Date().toISOString(),
          },
        })),
      toggleFavoriteRecipe: (recipeId) =>
        set((state) => {
          const exists = state.profile.favoriteRecipeIds.includes(recipeId)
          const favoriteRecipeIds = exists
            ? state.profile.favoriteRecipeIds.filter((id) => id !== recipeId)
            : [...state.profile.favoriteRecipeIds, recipeId]

          return {
            profile: {
              ...state.profile,
              favoriteRecipeIds,
              updatedAt: new Date().toISOString(),
            },
          }
        }),
      addCookedRecipe: (recipeId) =>
        set((state) => {
          if (state.profile.cookedRecipes.includes(recipeId)) {
            return state
          }

          return {
            profile: {
              ...state.profile,
              cookedRecipes: [...state.profile.cookedRecipes, recipeId],
              updatedAt: new Date().toISOString(),
            },
          }
        }),
      updateMacroTarget: (macroTarget) =>
        set((state) => ({
          profile: {
            ...state.profile,
            macroTarget: {
              ...state.profile.macroTarget,
              ...macroTarget,
            },
            updatedAt: new Date().toISOString(),
          },
        })),
    }),
    {
      name: 'ai-smart-profile',
    },
  ),
)
