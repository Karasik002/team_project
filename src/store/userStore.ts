import { create } from 'zustand';
import { nanoid } from '../utils/nanoid';
import {
  Allergy,
  CookingHistoryItem,
  NutritionGoal,
  UserProfile,
  Recipe
} from '../types';

type UserState = {
  profile: UserProfile;
  cookingHistory: CookingHistoryItem[];
  favouriteRecipes: Record<string, Recipe>;
  completeRecipe: (recipe: Recipe, rating?: number, notes?: string) => void;
  setAllergies: (allergies: Allergy[]) => void;
  updateGoals: (goals: NutritionGoal) => void;
  toggleFavouriteRecipe: (recipe: Recipe) => void;
};

const initialProfile: UserProfile = {
  id: 'user-1',
  name: 'Марина',
  allergies: ['арахіс'],
  diets: ['вегетаріанець'],
  favouriteCuisines: ['італійська', 'середземноморська'],
  favouriteDishes: ['паста', 'рамен'],
  bannedIngredients: ['арахіс'],
  goals: {
    calories: 1900,
    protein: 110,
    carbs: 200,
    fats: 60,
    goal: 'підтримка ваги'
  },
  experienceLevel: 'ентузіаст'
};

export const useUserStore = create<UserState>((set) => ({
  profile: initialProfile,
  cookingHistory: [],
  favouriteRecipes: {},
  completeRecipe: (recipe, rating, notes) =>
    set((state) => ({
      cookingHistory: [
        {
          recipeId: recipe.id,
          cookedAt: new Date().toISOString(),
          rating,
          notes
        },
        ...state.cookingHistory
      ]
    })),
  setAllergies: (allergies) =>
    set((state) => ({
      profile: { ...state.profile, allergies }
    })),
  updateGoals: (goals) =>
    set((state) => ({
      profile: { ...state.profile, goals }
    })),
  toggleFavouriteRecipe: (recipe) =>
    set((state) => {
      const exists = Boolean(state.favouriteRecipes[recipe.id]);
      const favouriteRecipes = { ...state.favouriteRecipes };
      if (exists) {
        delete favouriteRecipes[recipe.id];
      } else {
        favouriteRecipes[recipe.id] = { ...recipe, liked: true };
      }
      return { favouriteRecipes };
    })
}));

export const createHistoryItem = (
  overrides: Partial<CookingHistoryItem> = {}
): CookingHistoryItem => ({
  recipeId: overrides.recipeId ?? nanoid('history'),
  cookedAt: overrides.cookedAt ?? new Date().toISOString(),
  rating: overrides.rating,
  notes: overrides.notes
});
