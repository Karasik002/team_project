import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { v4 as uuid } from 'uuid'
import type { Recipe, ShoppingListItem } from '../types'

interface ShoppingListState {
  items: ShoppingListItem[]
  addItem: (item: Omit<ShoppingListItem, 'id' | 'addedAt'>) => void
  toggleItem: (id: string) => void
  removeItem: (id: string) => void
  clearCompleted: () => void
  syncMissingIngredients: (recipe: Recipe) => void
}

export const useShoppingListStore = create<ShoppingListState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) =>
        set((state) => ({
          items: [
            ...state.items,
            {
              ...item,
              id: uuid(),
              addedAt: new Date().toISOString(),
            },
          ],
        })),
      toggleItem: (id) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id
              ? { ...item, completed: !item.completed }
              : item,
          ),
        })),
      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),
      clearCompleted: () =>
        set((state) => ({
          items: state.items.filter((item) => !item.completed),
        })),
      syncMissingIngredients: (recipe) => {
        const currentItems = get().items
        const missing = recipe.ingredients.filter((ingredient) => ingredient.optional)

        const newItems: ShoppingListItem[] = missing
          .filter((ingredient) => !currentItems.some((item) => item.name === ingredient.name))
          .map((ingredient) => ({
            id: uuid(),
            name: ingredient.name.replace(/^Рекомендовано додати:\s*/i, ''),
            quantity: ingredient.quantity,
            unit: ingredient.unit,
            recipeId: recipe.id,
            completed: false,
            addedAt: new Date().toISOString(),
          }))

        if (newItems.length === 0) return

        set((state) => ({
          items: [...state.items, ...newItems],
        }))
      },
    }),
    {
      name: 'ai-smart-shopping-list',
    },
  ),
)
