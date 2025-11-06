export type DietaryPreference = 'omnivore' | 'vegetarian' | 'vegan' | 'pescatarian' | 'keto' | 'paleo' | 'gluten-free'

export type Allergy =
  | 'nuts'
  | 'dairy'
  | 'eggs'
  | 'shellfish'
  | 'soy'
  | 'wheat'
  | 'sesame'
  | 'gluten'
  | 'sulfites'

export interface NutritionBreakdown {
  calories: number
  protein: number
  carbs: number
  fats: number
  fiber?: number
  sugar?: number
}

export interface RecipeIngredient {
  name: string
  quantity: number
  unit: string
  optional?: boolean
}

export interface CookingStep {
  id: string
  order: number
  instruction: string
  durationMinutes?: number
  tips?: string
}

export interface RecipeSuggestion {
  pairing: string
  description: string
}

export interface VideoGuide {
  platform: 'youtube' | 'vimeo' | 'loom' | 'internal'
  url: string
}

export interface Recipe {
  id: string
  title: string
  description: string
  image: string
  video: VideoGuide
  ingredients: RecipeIngredient[]
  steps: CookingStep[]
  nutrition: NutritionBreakdown
  suggestions: RecipeSuggestion[]
  leftoverIdeas: string[]
  suitableFor: DietaryPreference[]
  allergiesSafe: Allergy[]
  difficulty: 'easy' | 'medium' | 'hard'
  totalTime: number
  activeTime: number
  servings: number
  rating: number
  reviews: number
  createdAt: string
  aiNotes: string
  noveltyScore: number
}

export interface IngredientInsight {
  ingredient: string
  replacements: string[]
  pantryStatus: 'in-pantry' | 'low' | 'missing'
  barcode?: string
}

export interface UserProfile {
  id: string
  name: string
  avatar: string
  allergies: Allergy[]
  dietaryPreferences: DietaryPreference[]
  favoriteCuisines: string[]
  dislikedIngredients: string[]
  fitnessGoal: 'maintain' | 'lose' | 'gain'
  caloricTarget: number
  macroTarget: NutritionBreakdown
  favoriteRecipeIds: string[]
  cookedRecipes: string[]
  voiceAssistant: boolean
  kitchenModeVoiceGuidance: boolean
  createdAt: string
  updatedAt: string
}

export interface PantryItem {
  id: string
  name: string
  quantity: number
  unit: string
  category: 'produce' | 'protein' | 'dairy' | 'grains' | 'spices' | 'canned' | 'frozen' | 'other'
  expiryDate?: string
  barcode?: string
  storageLocation?: 'pantry' | 'fridge' | 'freezer'
  nutrition?: NutritionBreakdown
  costEstimate?: number
  addedAt: string
  updatedAt: string
}

export interface ShoppingListItem {
  id: string
  name: string
  quantity: number
  unit: string
  category?: string
  recipeId?: string
  completed: boolean
  addedAt: string
}

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  progress: number
  goal: number
  rewardPoints: number
  unlockedAt?: string
}

export interface CulinaryChallenge {
  id: string
  title: string
  description: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  rewardPoints: number
  deadline: string
  progress: number
  goal: number
}

export interface CommunityComment {
  id: string
  author: {
    name: string
    avatar: string
  }
  message: string
  createdAt: string
}

export interface CommunityPost {
  id: string
  author: {
    name: string
    avatar: string
  }
  title: string
  description: string
  image: string
  recipeId?: string
  likes: number
  tags: string[]
  createdAt: string
  comments: CommunityComment[]
}

export interface VoiceCue {
  stepId: string
  instruction: string
  durationSeconds?: number
}

export interface KitchenSession {
  recipeId: string
  currentStepIndex: number
  timers: Record<string, { remainingSeconds: number; isActive: boolean }>
}
