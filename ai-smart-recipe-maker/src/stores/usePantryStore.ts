import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { v4 as uuid } from 'uuid'
import { barcodeCatalog } from '../data/barcodes'
import type { PantryItem } from '../types'

interface PantryState {
  items: PantryItem[]
  addCustomItem: (item: Omit<PantryItem, 'id' | 'addedAt' | 'updatedAt'>) => void
  importByBarcode: (barcode: string, overrides?: Partial<Omit<PantryItem, 'id'>>) => PantryItem | null
  updateItem: (id: string, updates: Partial<PantryItem>) => void
  removeItem: (id: string) => void
  consumeQuantity: (id: string, quantity: number) => void
  getExpiringSoon: (days?: number) => PantryItem[]
}

const buildPantryItem = (input: Omit<PantryItem, 'id' | 'addedAt' | 'updatedAt'>): PantryItem => {
  const timestamp = new Date().toISOString()

  return {
    ...input,
    id: uuid(),
    addedAt: timestamp,
    updatedAt: timestamp,
  }
}

export const usePantryStore = create<PantryState>()(
  persist(
    (set, get) => ({
      items: [],
      addCustomItem: (item) =>
        set((state) => ({
          items: [...state.items, buildPantryItem(item)],
        })),
      importByBarcode: (barcode, overrides = {}) => {
        const product = barcodeCatalog[barcode]
        if (!product) {
          return null
        }

        const pantryItem = buildPantryItem({
          name: product.name,
          quantity: overrides.quantity ?? product.defaultQuantity,
          unit: overrides.unit ?? product.unit,
          category: overrides.category ?? product.category,
          storageLocation: overrides.storageLocation ?? product.storageLocation,
          expiryDate: overrides.expiryDate,
          barcode,
          nutrition: product.nutrition,
          costEstimate: overrides.costEstimate,
        })

        set((state) => ({
          items: [...state.items, pantryItem],
        }))

        return pantryItem
      },
      updateItem: (id, updates) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id
              ? {
                  ...item,
                  ...updates,
                  updatedAt: new Date().toISOString(),
                }
              : item,
          ),
        })),
      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),
      consumeQuantity: (id, quantity) =>
        set((state) => ({
          items: state.items
            .map((item) =>
              item.id === id
                ? {
                    ...item,
                    quantity: Math.max(item.quantity - quantity, 0),
                    updatedAt: new Date().toISOString(),
                  }
                : item,
            )
            .filter((item) => item.quantity > 0),
        })),
      getExpiringSoon: (days = 3) => {
        const today = new Date()
        const threshold = new Date(today.getTime() + days * 24 * 60 * 60 * 1000)

        return get().items.filter((item) => {
          if (!item.expiryDate) return false
          return new Date(item.expiryDate) <= threshold
        })
      },
    }),
    {
      name: 'ai-smart-pantry',
    },
  ),
)
