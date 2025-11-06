export interface Ingredient {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  expirationDate?: Date;
  barcode?: string;
  category?: string;
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  videoUrl?: string;
  prepTime: number;
  cookTime: number;
  servings: number;
  difficulty: 'easy' | 'medium' | 'hard';
  ingredients: RecipeIngredient[];
  steps: string[];
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  tags: string[];
  author: string;
  rating: number;
  reviews: Review[];
  createdAt: Date;
}

export interface RecipeIngredient {
  name: string;
  quantity: number;
  unit: string;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: Date;
  images?: string[];
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  allergies: string[];
  dietaryPreferences: DietaryPreference[];
  favoriteRecipes: string[];
  cookingHistory: CookingHistory[];
  fitnessGoals?: FitnessGoals;
  achievements: Achievement[];
  level: number;
  points: number;
}

export type DietaryPreference = 'vegan' | 'vegetarian' | 'keto' | 'paleo' | 'glutenFree' | 'dairyFree' | 'lowCarb' | 'lowFat';

export interface CookingHistory {
  recipeId: string;
  recipeName: string;
  cookedAt: Date;
  rating?: number;
  notes?: string;
}

export interface FitnessGoals {
  dailyCalories?: number;
  dailyProtein?: number;
  dailyCarbs?: number;
  dailyFat?: number;
  goal: 'loseWeight' | 'gainMuscle' | 'maintain' | 'general';
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
  progress?: number;
  maxProgress?: number;
}

export interface ShoppingList {
  id: string;
  items: ShoppingItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ShoppingItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: string;
  purchased: boolean;
  barcode?: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  reward: number;
  deadline?: Date;
  requirements: string[];
  completed: boolean;
}
