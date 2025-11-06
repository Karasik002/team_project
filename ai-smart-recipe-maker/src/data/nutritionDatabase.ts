import type { NutritionBreakdown } from '../types'

export const nutritionDatabase: Record<string, NutritionBreakdown> = {
  'куряче філе': { calories: 165, protein: 31, carbs: 0, fats: 3.6 },
  лосось: { calories: 208, protein: 20, carbs: 0, fats: 13 },
  'квасоля чорна': { calories: 339, protein: 21, carbs: 62, fats: 0.9, fiber: 16 },
  'авокадо': { calories: 160, protein: 2, carbs: 9, fats: 15, fiber: 7 },
  'квінуа': { calories: 120, protein: 4.4, carbs: 21, fats: 1.9, fiber: 2.8 },
  шпинат: { calories: 23, protein: 2.9, carbs: 3.6, fats: 0.4, fiber: 2.2 },
  'солодка картопля': { calories: 86, protein: 1.6, carbs: 20, fats: 0.1, fiber: 3 },
  нут: { calories: 164, protein: 9, carbs: 27, fats: 2.6, fiber: 7.6 },
  тофу: { calories: 76, protein: 8, carbs: 1.9, fats: 4.8 },
  'коричневий рис': { calories: 111, protein: 2.6, carbs: 23, fats: 0.9, fiber: 1.8 },
  броколі: { calories: 55, protein: 3.7, carbs: 11, fats: 0.6, fiber: 3.8 },
  'оливкова олія': { calories: 119, protein: 0, carbs: 0, fats: 13.5 },
  'томат чері': { calories: 18, protein: 0.9, carbs: 3.9, fats: 0.2, fiber: 1.2 },
  'чіа насіння': { calories: 486, protein: 16, carbs: 42, fats: 31, fiber: 34 },
  'яблуко': { calories: 52, protein: 0.3, carbs: 14, fats: 0.2, fiber: 2.4 },
  'вівсянка': { calories: 68, protein: 2.4, carbs: 12, fats: 1.4, fiber: 1.7 },
  'грецький йогурт': { calories: 59, protein: 10, carbs: 3.6, fats: 0.4 },
  'мигдальне молоко': { calories: 17, protein: 0.6, carbs: 0.6, fats: 1.5 },
  'чорниця': { calories: 57, protein: 0.7, carbs: 14, fats: 0.3, fiber: 2.4 },
  'бурий цукор': { calories: 387, protein: 0, carbs: 100, fats: 0 },
  'зелений горошок': { calories: 81, protein: 5, carbs: 14, fats: 0.4, fiber: 5.7 },
  морква: { calories: 41, protein: 0.9, carbs: 9.6, fats: 0.2, fiber: 2.8 },
  'кокосове молоко': { calories: 230, protein: 2.3, carbs: 5.5, fats: 24 },
  'лайм': { calories: 30, protein: 0.7, carbs: 11, fats: 0.2 },
  'кунжутне насіння': { calories: 573, protein: 18, carbs: 23, fats: 50, fiber: 11.8 },
}

export const getNutritionForIngredient = (name: string): NutritionBreakdown | null => {
  const key = name.toLowerCase()
  return nutritionDatabase[key] ?? null
}
