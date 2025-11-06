import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import { FavoriteRecipe, UserProfile } from "../types";

interface UserState {
  profile: UserProfile;
  updateProfile: (profile: Partial<UserProfile>) => void;
  toggleDietPreference: (diet: UserProfile["preferences"]["diets"][number]) => void;
  addAllergy: (allergy: string) => void;
  removeAllergy: (allergy: string) => void;
  toggleFavoriteRecipe: (recipe: FavoriteRecipe) => void;
  logCookingHistory: (entry: UserProfile["history"][number]) => void;
  resetHistory: () => void;
}

const defaultProfile: UserProfile = {
  id: "user-1",
  name: "Кулінарний дослідник",
  avatarColor: "#ff7043",
  preferences: {
    allergies: ["арахіс"],
    diets: ["balanced"],
    dislikedIngredients: ["коріандр"],
    favoriteCuisines: ["середземноморська", "азійська"],
    fitnessGoal: "maintain"
  },
  favoriteRecipes: [],
  history: []
};

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      profile: defaultProfile,
      updateProfile: (profile) =>
        set((state) => ({
          profile: {
            ...state.profile,
            ...profile,
            preferences: {
              ...state.profile.preferences,
              ...(profile.preferences ?? {})
            }
          }
        })),
      toggleDietPreference: (diet) =>
        set((state) => {
          const diets = state.profile.preferences.diets;
          const exists = diets.includes(diet);
          return {
            profile: {
              ...state.profile,
              preferences: {
                ...state.profile.preferences,
                diets: exists ? diets.filter((item) => item !== diet) : [...diets, diet]
              }
            }
          };
        }),
      addAllergy: (allergy) =>
        set((state) => ({
          profile: {
            ...state.profile,
            preferences: {
              ...state.profile.preferences,
              allergies: Array.from(
                new Set([...state.profile.preferences.allergies, allergy.toLowerCase()])
              )
            }
          }
        })),
      removeAllergy: (allergy) =>
        set((state) => ({
          profile: {
            ...state.profile,
            preferences: {
              ...state.profile.preferences,
              allergies: state.profile.preferences.allergies.filter(
                (item) => item !== allergy
              )
            }
          }
        })),
      toggleFavoriteRecipe: (recipe) =>
        set((state) => {
          const exists = state.profile.favoriteRecipes.some((fav) => fav.id === recipe.id);
          return {
            profile: {
              ...state.profile,
              favoriteRecipes: exists
                ? state.profile.favoriteRecipes.filter((fav) => fav.id !== recipe.id)
                : [...state.profile.favoriteRecipes, recipe]
            }
          };
        }),
      logCookingHistory: (entry) =>
        set((state) => ({
          profile: {
            ...state.profile,
            history: [entry, ...state.profile.history].slice(0, 50)
          }
        })),
      resetHistory: () =>
        set((state) => ({
          profile: {
            ...state.profile,
            history: []
          }
        }))
    }),
    {
      name: "ai-smart-recipe-maker-profile",
      storage: createJSONStorage(() => localStorage)
    }
  )
);
