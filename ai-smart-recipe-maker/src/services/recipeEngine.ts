import { v4 as uuid } from 'uuid'
import { recipeTemplates } from '../data/recipeTemplates'
import { getNutritionForIngredient } from '../data/nutritionDatabase'
import type {
  PantryItem,
  Recipe,
  RecipeIngredient,
  UserProfile,
  NutritionBreakdown,
  DietaryPreference,
} from '../types'
import type { RecipeTemplate } from '../data/recipeTemplates'

export interface GenerateRecipesInput {
  ingredients: string[]
  profile: UserProfile
  pantryItems: PantryItem[]
  options?: {
    prioritizeBudget?: boolean
    useLeftovers?: boolean
    servings?: number
    excludeIngredients?: string[]
  }
}

interface TemplateScore {
  template: RecipeTemplate
  score: number
  missingIngredients: string[]
}

const normalize = (value: string) => value.trim().toLowerCase()

const DEFAULT_INGREDIENT_QUANTITIES: Record<string, { quantity: number; unit: string }> = {
  лосось: { quantity: 180, unit: 'г' },
  квінуа: { quantity: 120, unit: 'г' },
  шпинат: { quantity: 60, unit: 'г' },
  авокадо: { quantity: 1, unit: 'шт' },
  тофу: { quantity: 150, unit: 'г' },
  'коричневий рис': { quantity: 140, unit: 'г' },
  броколі: { quantity: 100, unit: 'г' },
  морква: { quantity: 80, unit: 'г' },
  нут: { quantity: 160, unit: 'г' },
  'томат чері': { quantity: 120, unit: 'г' },
  'чорниця': { quantity: 80, unit: 'г' },
  'чіа насіння': { quantity: 25, unit: 'г' },
  'грецький йогурт': { quantity: 180, unit: 'г' },
  'мигдальне молоко': { quantity: 200, unit: 'мл' },
}

const BASE_PANTRY_INGREDIENTS: RecipeIngredient[] = [
  { name: 'Оливкова олія', quantity: 15, unit: 'мл' },
  { name: 'Сіль морська', quantity: 3, unit: 'г' },
  { name: 'Свіжомелений перець', quantity: 1, unit: 'г' },
]

const mergeNutrition = (items: NutritionBreakdown[]): NutritionBreakdown =>
  items.reduce(
    (acc, item) => ({
      calories: acc.calories + (item.calories ?? 0),
      protein: acc.protein + (item.protein ?? 0),
      carbs: acc.carbs + (item.carbs ?? 0),
      fats: acc.fats + (item.fats ?? 0),
      fiber: (acc.fiber ?? 0) + (item.fiber ?? 0),
      sugar: (acc.sugar ?? 0) + (item.sugar ?? 0),
    }),
    { calories: 0, protein: 0, carbs: 0, fats: 0, fiber: 0, sugar: 0 },
  )

const formatIngredientName = (ingredient: string): string => {
  if (!ingredient) return ''
  const [first, ...rest] = ingredient.split(' ')
  return [first.charAt(0).toUpperCase() + first.slice(1), ...rest].join(' ')
}

const dietMatchesTemplate = (dietaryPreferences: DietaryPreference[], template: RecipeTemplate) => {
  if (dietaryPreferences.length === 0) return true

  return dietaryPreferences.every((pref) => {
    if (pref === 'omnivore') return true
    if (pref === 'gluten-free') {
      return template.allergySafe.includes('gluten')
    }
    return template.dietCompatibility.includes(pref)
  })
}

const templateSupportsAllergies = (allergies: string[], template: RecipeTemplate) => {
  if (allergies.length === 0) return true
  return allergies.every((allergy) => template.allergySafe.includes(allergy as any))
}

const calculateTemplateScore = (
  template: RecipeTemplate,
  inputIngredients: string[],
  pantryItems: PantryItem[],
): TemplateScore => {
  const pantrySet = new Set(pantryItems.map((item) => normalize(item.name)))
  const ingredientSet = new Set(inputIngredients)

  const matchCount = template.matches.filter((match) =>
    ingredientSet.has(match) || pantrySet.has(match),
  ).length

  const missingIngredients = template.matches.filter(
    (match) => !ingredientSet.has(match) && !pantrySet.has(match),
  )

  const availabilityBoost = template.matches.filter((match) => pantrySet.has(match)).length * 0.3
  const score = matchCount + availabilityBoost - missingIngredients.length * 0.1

  return {
    template,
    score,
    missingIngredients,
  }
}

const buildRecipeIngredients = (
  template: RecipeTemplate,
  normalizedInput: string[],
  missingIngredients: string[],
  options?: GenerateRecipesInput['options'],
): RecipeIngredient[] => {
  const servingsMultiplier = options?.servings ? options.servings / template.defaultServings : 1

  const primaryIngredients: RecipeIngredient[] = template.matches.map((ingredient) => {
    const defaults = DEFAULT_INGREDIENT_QUANTITIES[ingredient] ?? { quantity: 100, unit: 'г' }
    return {
      name: formatIngredientName(ingredient),
      quantity: Math.round(defaults.quantity * servingsMultiplier),
      unit: defaults.unit,
      optional: false,
    }
  })

  const supportiveIngredients: RecipeIngredient[] = BASE_PANTRY_INGREDIENTS.map((ingredient) => ({
    ...ingredient,
    quantity: Math.round(ingredient.quantity * servingsMultiplier),
  }))

  const innovationIngredients: RecipeIngredient[] = missingIngredients.map((ingredient) => ({
    name: `Рекомендовано додати: ${formatIngredientName(ingredient)}`,
    quantity: 1,
    unit: 'позиція',
    optional: true,
  }))

  const uniqueInput = normalizedInput.filter(
    (item) => !template.matches.includes(item) && !missingIngredients.includes(item),
  )

  const personalizedIngredients: RecipeIngredient[] = uniqueInput.map((ingredient) => ({
    name: `Авторський штрих: ${formatIngredientName(ingredient)}`,
    quantity: 1,
    unit: 'на смак',
    optional: true,
  }))

  return [...primaryIngredients, ...supportiveIngredients, ...innovationIngredients, ...personalizedIngredients]
}

const estimateNutrition = (ingredients: RecipeIngredient[], servings: number): NutritionBreakdown => {
  const nutritionItems: NutritionBreakdown[] = ingredients
    .map((ingredient) => {
      const name = ingredient.name.replace(/^Авторський штрих:\s*/i, '').replace(/^Рекомендовано додати:\s*/i, '')
      const nutrition = getNutritionForIngredient(name.toLowerCase())
      if (!nutrition) {
        return null
      }

      const factor = ingredient.unit === 'г' || ingredient.unit === 'мл'
        ? ingredient.quantity / 100
        : ingredient.quantity

      return {
        calories: nutrition.calories * factor,
        protein: nutrition.protein * factor,
        carbs: nutrition.carbs * factor,
        fats: nutrition.fats * factor,
        fiber: nutrition.fiber ? nutrition.fiber * factor : undefined,
        sugar: nutrition.sugar ? nutrition.sugar * factor : undefined,
      } as NutritionBreakdown
    })
    .filter(Boolean) as NutritionBreakdown[]

  if (nutritionItems.length === 0) {
    return {
      calories: 480,
      protein: 25,
      carbs: 45,
      fats: 20,
    }
  }

  const aggregated = mergeNutrition(nutritionItems)

  return {
    calories: Math.round(aggregated.calories / servings),
    protein: Math.round(aggregated.protein / servings),
    carbs: Math.round(aggregated.carbs / servings),
    fats: Math.round(aggregated.fats / servings),
    fiber: aggregated.fiber ? Math.round(aggregated.fiber / servings) : undefined,
    sugar: aggregated.sugar ? Math.round(aggregated.sugar / servings) : undefined,
  }
}

const buildAiNotes = (
  profile: UserProfile,
  personalizedIngredients: string[],
  options?: GenerateRecipesInput['options'],
) => {
  const dietLine = profile.dietaryPreferences.includes('vegan')
    ? 'Рецепт повністю відповідає вашому веганському стилю харчування.'
    : profile.dietaryPreferences.includes('keto')
      ? 'Страва підтримує високий вміст білку та корисних жирів для кето-режиму.'
      : 'Рецепт адаптовано під ваші вподобання, зберігаючи збалансованість БЖВ.'

  const varietyLine = personalizedIngredients.length
    ? `AI додав авторські штрихи: ${personalizedIngredients.map(formatIngredientName).join(', ')}.`
    : 'AI зосередився на оптимальному використанні ваших запасів.'

  const goalLine = profile.fitnessGoal === 'lose'
    ? 'Калорійність підібрано для дефіциту з акцентом на білок та клітковину.'
    : profile.fitnessGoal === 'gain'
      ? 'Страва має підвищену енергетичну цінність для набору якісної маси.'
      : 'Баланс макросів відповідає вашому режиму підтримки форми.'

  const leftoverLine = options?.useLeftovers
    ? 'Особливу увагу приділено ідеям використання залишків, щоб уникнути марнування продуктів.'
    : 'AI готовий запропонувати ідеї для використання залишків, якщо це буде потрібно.'

  return `${dietLine} ${goalLine} ${varietyLine} ${leftoverLine}`
}

export const generateSmartRecipes = ({
  ingredients,
  profile,
  pantryItems,
  options,
}: GenerateRecipesInput): Recipe[] => {
  const normalizedInput = ingredients
    .map(normalize)
    .filter((value, index, self) => value && self.indexOf(value) === index)

  const templates = recipeTemplates
    .filter((template) => dietMatchesTemplate(profile.dietaryPreferences, template))
    .filter((template) => templateSupportsAllergies(profile.allergies, template))
    .map((template) => calculateTemplateScore(template, normalizedInput, pantryItems))
    .filter((item) => item.score > 0 || normalizedInput.length === 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)

  const fallbackTemplates = recipeTemplates.filter((template) =>
    !templates.find((item) => item.template.id === template.id),
  )

  const combinedTemplates = templates.length > 0 ? templates : fallbackTemplates.map((template) => ({
    template,
    score: 1,
    missingIngredients: [],
  }))

  return combinedTemplates.map(({ template, missingIngredients }, index) => {
    const servings = options?.servings ?? template.defaultServings
    const recipeIngredients = buildRecipeIngredients(template, normalizedInput, missingIngredients, options)
    const nutritionPerServing = estimateNutrition(recipeIngredients, servings)
    const personalizedIngredients = normalizedInput.filter((item) => !template.matches.includes(item))
    const noveltyPenalty = profile.cookedRecipes.includes(template.id) ? 0.5 : 1

    return {
      id: `${template.id}-${uuid().slice(0, 8)}`,
      title: template.title,
      description: template.baseDescription,
      image: template.heroImage,
      video: template.video,
      ingredients: recipeIngredients,
      steps: template.steps.map((step, stepIndex) => ({
        id: `${template.id}-step-${stepIndex}`,
        order: stepIndex + 1,
        instruction: step.instruction,
        durationMinutes: step.durationMinutes,
        tips: step.tip,
      })),
      nutrition: nutritionPerServing,
      suggestions: template.suggestions,
      leftoverIdeas: options?.useLeftovers
        ? template.leftoverIdeas
        : template.leftoverIdeas.slice(0, 1),
      suitableFor: template.dietCompatibility,
      allergiesSafe: template.allergySafe,
      difficulty: template.difficulty,
      totalTime: template.totalTime,
      activeTime: template.activeTime,
      servings,
      rating: 4.6 + index * 0.1,
      reviews: 120 + index * 12,
      createdAt: new Date().toISOString(),
      aiNotes: buildAiNotes(profile, personalizedIngredients, options),
      noveltyScore: Math.min(1, Math.max(0.35, (index + 1) / combinedTemplates.length * noveltyPenalty)),
    }
  })
}
