export type DietPreference = "vegan" | "vegetarian" | "keto" | "paleo" | "balanced";

export interface ProfilePreferences {
  allergies: string[];
  diets: DietPreference[];
  dislikedIngredients: string[];
  favoriteCuisines: string[];
  fitnessGoal:
    | "maintain"
    | "lose_weight"
    | "gain_muscle"
    | "improve_endurance";
}

export interface FavoriteRecipe {
  id: string;
  name: string;
  lastCookedAt?: string;
}

export interface CookingHistoryEntry {
  recipeId: string;
  cookedAt: string;
  rating?: number;
  notes?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  avatarColor: string;
  preferences: ProfilePreferences;
  favoriteRecipes: FavoriteRecipe[];
  history: CookingHistoryEntry[];
}

export interface IngredientInputData {
  name: string;
  amount?: string;
}

export interface NutritionBreakdown {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  fiber: number;
}

export interface RecipeStep {
  order: number;
  instruction: string;
  tip?: string;
  durationMinutes?: number;
}

export interface RecipeSource {
  videoUrl?: string;
  inspiration?: string;
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  ingredients: IngredientInputData[];
  instructions: RecipeStep[];
  nutrition: NutritionBreakdown;
  preparationTime: number;
  cookTime: number;
  servings: number;
  difficulty: "easy" | "medium" | "hard";
  cuisine: string;
  platingTips: string[];
  leftoversTip?: string;
  source: RecipeSource;
}

export interface PantryItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: "produce" | "protein" | "grain" | "dairy" | "spice" | "other";
  expiresAt?: string;
  barcode?: string;
  addedAt: string;
  pricePerUnit?: number;
}

export interface ShoppingListItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  reason: "missing" | "low_stock" | "suggested";
  relatesToRecipeId?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  unlockedAt?: string;
  icon: string;
  requirement: string;
}

export interface CulinaryChallenge {
  id: string;
  title: string;
  description: string;
  deadline: string;
  difficulty: "easy" | "medium" | "hard";
  rewardPoints: number;
  completedAt?: string;
}

export interface CommunityRecipe extends Recipe {
  author: string;
  likes: number;
  rating: number;
  reviews: Review[];
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  author: string;
  createdAt: string;
}

export interface AssistantSessionStep {
  id: string;
  instruction: string;
  spoken: boolean;
}

export type VoiceStatus = "idle" | "listening" | "speaking" | "error";
