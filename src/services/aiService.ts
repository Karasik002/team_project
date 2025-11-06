import { DateTime } from "luxon";
import { v4 as uuid } from "uuid";

import {
  IngredientInputData,
  PantryItem,
  Recipe,
  RecipeStep,
  UserProfile
} from "../types";

const cuisinePool = [
  "середземноморська",
  "азійська",
  "італійська",
  "мексиканська",
  "українська ф'южн",
  "японська",
  "індійська"
];

const difficultyByIngredientCount = (count: number): Recipe["difficulty"] => {
  if (count <= 5) return "easy";
  if (count <= 9) return "medium";
  return "hard";
};

const estimateNutrition = (ingredients: IngredientInputData[], profile: UserProfile) => {
  const baseCalories = 120 * ingredients.length + Math.random() * 80;
  const protein = ingredients.filter((ingredient) => /куриц|яйц|тофу|нут|горіх/i.test(ingredient.name))
    .length * 8;
  const carbs = ingredients.filter((ingredient) => /рис|макарон|картопл|зерн/i.test(ingredient.name))
    .length * 20;
  const fat = ingredients.filter((ingredient) => /масл|олив|горіх|насін/i.test(ingredient.name)).length * 6;
  const fiber = ingredients.filter((ingredient) => /зелень|овоч|брокол|лист/i.test(ingredient.name)).length * 4;

  const goalMultiplier =
    profile.preferences.fitnessGoal === "gain_muscle"
      ? 1.2
      : profile.preferences.fitnessGoal === "lose_weight"
      ? 0.85
      : 1;

  return {
    calories: Math.round(baseCalories * goalMultiplier),
    protein: Math.round((protein + 15) * goalMultiplier),
    fat: Math.round(fat + 12),
    carbs: Math.round(carbs + 30),
    fiber: Math.round(fiber + 6)
  };
};

const createInstructions = (ingredients: IngredientInputData[]): RecipeStep[] => {
  const baseSteps: RecipeStep[] = [
    {
      order: 1,
      instruction: "Підготуйте всі інгредієнти: промийте, наріжте та відміряйте потрібну кількість.",
      tip: "Сортуйте інгредієнти за часом додавання, щоб процес був плавним",
      durationMinutes: 8
    }
  ];

  if (ingredients.some((ingredient) => /циб|часн|овоч/i.test(ingredient.name))) {
    baseSteps.push({
      order: baseSteps.length + 1,
      instruction: "Обсмажте ароматичні інгредієнти на помірному вогні до золотистості.",
      tip: "Додавайте сіль на цьому етапі, щоб підсилити аромат.",
      durationMinutes: 5
    });
  }

  baseSteps.push(
    {
      order: baseSteps.length + 1,
      instruction: "Додайте основні інгредієнти та готуйте до бажаної текстури.",
      tip: "Починайте з тих продуктів, що готуються довше.",
      durationMinutes: 12
    },
    {
      order: baseSteps.length + 2,
      instruction: "Додайте спеції, соуси та доведіть страву до смаку.",
      tip: "Спробуйте страву та скоригуйте кислотність соком лимона або оцтом.",
      durationMinutes: 3
    },
    {
      order: baseSteps.length + 3,
      instruction: "Подавайте, прикрасивши свіжою зеленню та обраним гарніром.",
      tip: "Використовуйте контрастні кольори для ефектної подачі.",
      durationMinutes: 2
    }
  );

  return baseSteps;
};

const generatePlatingTips = (recipeTitle: string): string[] => [
  `Використовуйте теплу тарілку для підтримання температури ${recipeTitle}.`,
  "Додайте хрумкий елемент (насіння чи чіпси) для контрасту текстур.",
  "Покрапайте тарілку ароматною олією для ресторанної подачі."
];

const selectVideoGuide = (difficulty: Recipe["difficulty"]): string => {
  const playlist = {
    easy: "https://www.youtube.com/embed/pWZJ4lg4Ld8",
    medium: "https://www.youtube.com/embed/-lnnml2xNqg",
    hard: "https://www.youtube.com/embed/evJ6sE7T8WQ"
  } as const;

  return playlist[difficulty];
};

const optimizeForLeftovers = (ingredients: IngredientInputData[], pantry: PantryItem[]): string => {
  const soonExpiring = pantry.filter((item) =>
    item.expiresAt ? DateTime.fromISO(item.expiresAt) < DateTime.now().plus({ days: 3 }) : false
  );

  if (!soonExpiring.length) {
    return "Зберігайте у герметичному контейнері та використайте протягом 2 днів.";
  }

  const names = soonExpiring.map((item) => item.name).join(", ");
  return `Додайте залишки ${names} у салати або омлет наступного дня, щоб уникнути списання.`;
};

export interface GenerateRecipesOptions {
  maxRecipes?: number;
}

export const generateAIRecipes = async (
  ingredients: IngredientInputData[],
  profile: UserProfile,
  pantry: PantryItem[],
  options: GenerateRecipesOptions = {}
): Promise<Recipe[]> => {
  const maxRecipes = options.maxRecipes ?? 3;
  const baseName = ingredients.length ? ingredients[0].name : "Шеф-натхнення";

  const recipes: Recipe[] = Array.from({ length: maxRecipes }).map((_, index) => {
    const title = `${baseName} — креація №${index + 1}`;
    const difficulty = difficultyByIngredientCount(ingredients.length + index);
    const favoriteCuisines = profile.preferences.favoriteCuisines;
    const cuisine = favoriteCuisines.length
      ? favoriteCuisines[index % favoriteCuisines.length]
      : cuisinePool[Math.floor(Math.random() * cuisinePool.length)];
    const nutrition = estimateNutrition(ingredients, profile);

    return {
      id: uuid(),
      title,
      description: `Інноваційна страва у стилі ${cuisine} з урахуванням ваших вподобань.`,
      imageUrl: `https://source.unsplash.com/featured/800x600?${encodeURIComponent(
        ingredients.map((ingredient) => ingredient.name).join(",") || "gourmet"
      )}&sig=${index}`,
      ingredients,
      instructions: createInstructions(ingredients),
      nutrition,
      preparationTime: 10 + index * 5,
      cookTime: 15 + index * 5,
      servings: 2 + (index % 2),
      difficulty,
      cuisine,
      platingTips: generatePlatingTips(title),
      leftoversTip: optimizeForLeftovers(ingredients, pantry),
      source: {
        videoUrl: selectVideoGuide(difficulty),
        inspiration: "Generated by AI Smart Recipe Maker"
      }
    } satisfies Recipe;
  });

  // Emulate minimal latency
  await new Promise((resolve) => setTimeout(resolve, 450));

  return recipes;
};
