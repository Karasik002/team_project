import type { NutritionBreakdown } from '../types'

interface BarcodeProduct {
  name: string
  defaultQuantity: number
  unit: string
  category: 'produce' | 'protein' | 'dairy' | 'grains' | 'spices' | 'canned' | 'frozen' | 'other'
  storageLocation: 'pantry' | 'fridge' | 'freezer'
  nutrition: NutritionBreakdown
  image: string
  description: string
}

export const barcodeCatalog: Record<string, BarcodeProduct> = {
  '4820048890123': {
    name: 'Гречана крупа органічна',
    defaultQuantity: 1000,
    unit: 'г',
    category: 'grains',
    storageLocation: 'pantry',
    nutrition: {
      calories: 343,
      protein: 13,
      carbs: 71,
      fats: 3.4,
      fiber: 10,
    },
    image: 'https://images.unsplash.com/photo-1512399037499-4de5d95bf0a6?auto=format&fit=crop&w=600&q=80',
    description: 'Цільнозернова органічна гречка для поживних каш і салатів.',
  },
  '4820012345678': {
    name: 'Філе лосося охолоджене',
    defaultQuantity: 500,
    unit: 'г',
    category: 'protein',
    storageLocation: 'fridge',
    nutrition: {
      calories: 208,
      protein: 20,
      carbs: 0,
      fats: 13,
    },
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80',
    description: 'Ніжне філе атлантичного лосося, ідеально для запікання і суші.',
  },
  '4820098765432': {
    name: 'Мигдальне молоко без цукру',
    defaultQuantity: 1000,
    unit: 'мл',
    category: 'dairy',
    storageLocation: 'fridge',
    nutrition: {
      calories: 15,
      protein: 1,
      carbs: 1,
      fats: 1.2,
    },
    image: 'https://images.unsplash.com/photo-1542444459-db63c2b4fc2b?auto=format&fit=crop&w=600&q=80',
    description: 'Рослинне молоко без лактози, збагачене кальцієм та вітаміном D.',
  },
  '4820005554321': {
    name: 'Авокадо Хасс стиглий',
    defaultQuantity: 2,
    unit: 'шт',
    category: 'produce',
    storageLocation: 'fridge',
    nutrition: {
      calories: 160,
      protein: 2,
      carbs: 9,
      fats: 15,
      fiber: 7,
    },
    image: 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&w=600&q=80',
    description: 'Кремове авокадо, відмінне джерело корисних жирів та клітковини.',
  },
}

export type BarcodeKey = keyof typeof barcodeCatalog
