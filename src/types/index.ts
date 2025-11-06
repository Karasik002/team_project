export type IngredientInput = {
  name: string;
  quantity?: string;
};

export type MacroBreakdown = {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
};

export type RecipeStep = {
  title: string;
  detail: string;
  tips?: string[];
  durationMinutes?: number;
};

export type Recipe = {
  id: string;
  title: string;
  description: string;
  image: string;
  videoUrl: string;
  servings: number;
  difficulty: 'easy' | 'medium' | 'hard';
  cuisine: string;
  macros: MacroBreakdown;
  steps: RecipeStep[];
  missingIngredients: string[];
  tags: string[];
  leftoverStrategy?: string;
  platingTips?: string[];
  sustainabilityScore?: number;
  liked?: boolean;
  createdAt: string;
};

export type DietPreference = 'веган' | 'кето' | 'вегетаріанець' | 'без глютену' | 'без лактози';

export type Allergy = 'арахіс' | 'морепродукти' | 'глютен' | 'молоко' | 'яйця' | 'соєві';

export type FitnessGoal = 'підтримка ваги' | 'набір мязів' | 'схуднення';

export type NutritionGoal = {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  goal: FitnessGoal;
};

export type UserProfile = {
  id: string;
  name: string;
  allergies: Allergy[];
  diets: DietPreference[];
  favouriteCuisines: string[];
  favouriteDishes: string[];
  bannedIngredients: string[];
  goals: NutritionGoal;
  experienceLevel: 'початківець' | 'ентузіаст' | 'шеф';
};

export type PantryItem = {
  id: string;
  name: string;
  quantity: number;
  unit: 'шт' | 'г' | 'кг' | 'мл' | 'л' | 'порція';
  category: 'овочі' | 'фрукти' | 'мясо' | 'риба' | 'бакалія' | 'молочні' | 'спеції' | 'заморожені' | 'інші';
  barcode?: string;
  expiresAt: string;
  storage: 'холодильник' | 'морозильник' | 'кімнатна температура';
};

export type ShoppingListItem = {
  id: string;
  ingredient: string;
  quantity: string;
  addedAt: string;
  reason: 'бракує' | 'рекомендація' | 'авто-поповнення';
  checked: boolean;
};

export type CookingHistoryItem = {
  recipeId: string;
  cookedAt: string;
  rating?: number;
  notes?: string;
};

export type Achievement = {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: string | null;
  progress: number;
  target: number;
};

export type Challenge = {
  id: string;
  title: string;
  description: string;
  rewardXp: number;
  expiresAt: string;
  status: 'active' | 'completed' | 'upcoming';
};

export type AssistantPrompt = {
  id: string;
  role: 'system' | 'user' | 'assistant';
  content: string;
  createdAt: string;
};

export type VoiceCommand = {
  transcript: string;
  confidence: number;
};

export type ExpiryAlert = {
  itemId: string;
  name: string;
  expiresInDays: number;
};
