import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { v4 as uuid } from "uuid";

import { CommunityRecipe, Review } from "../types";

interface CommunityState {
  recipes: CommunityRecipe[];
  addRecipe: (recipe: Omit<CommunityRecipe, "id" | "likes" | "rating" | "reviews">) => void;
  toggleLike: (recipeId: string) => void;
  addReview: (recipeId: string, review: Omit<Review, "id" | "createdAt">) => void;
}

const sampleCommunityRecipes: CommunityRecipe[] = [
  {
    id: uuid(),
    title: "Миска енергії з кіноа",
    description: "Кольорова миска з кіноа, нутом та соусом тахіні",
    imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80",
    ingredients: [
      { name: "Кіноа", amount: "1 склянка" },
      { name: "Нут", amount: "200 г" },
      { name: "Овочі на вибір", amount: "300 г" }
    ],
    instructions: [
      { order: 1, instruction: "Промийте та відваріть кіноа" },
      { order: 2, instruction: "Запечіть нут зі спеціями" },
      { order: 3, instruction: "Зберіть миску та полийте соусом" }
    ],
    nutrition: { calories: 520, protein: 22, fat: 14, carbs: 70, fiber: 12 },
    preparationTime: 10,
    cookTime: 25,
    servings: 2,
    difficulty: "easy",
    cuisine: "ф'южн",
    platingTips: ["Використовуйте глибоку тарілку", "Додайте мікрозелень зверху"],
    leftoversTip: "Зберігайте окремо від соусу, щоб уникнути розмокання",
    source: { videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
    author: "Дарина",
    likes: 42,
    rating: 4.7,
    reviews: []
  }
];

export const useCommunityStore = create<CommunityState>()(
  persist(
    (set) => ({
      recipes: sampleCommunityRecipes,
      addRecipe: (recipe) =>
        set((state) => ({
          recipes: [
            {
              ...recipe,
              id: uuid(),
              likes: 0,
              rating: 5,
              reviews: []
            },
            ...state.recipes
          ]
        })),
      toggleLike: (recipeId) =>
        set((state) => ({
          recipes: state.recipes.map((recipe) =>
            recipe.id === recipeId
              ? {
                  ...recipe,
                  likes: recipe.likes + 1
                }
              : recipe
          )
        })),
      addReview: (recipeId, review) =>
        set((state) => ({
          recipes: state.recipes.map((recipe) =>
            recipe.id === recipeId
              ? {
                  ...recipe,
                  reviews: [
                    {
                      ...review,
                      id: uuid(),
                      createdAt: new Date().toISOString()
                    },
                    ...recipe.reviews
                  ],
                  rating: Math.min(5, (recipe.rating + review.rating) / 2)
                }
              : recipe
          )
        }))
    }),
    {
      name: "ai-smart-recipe-maker-community",
      storage: createJSONStorage(() => localStorage)
    }
  )
);
