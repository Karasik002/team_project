import { DateTime } from "luxon";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { v4 as uuid } from "uuid";

import { PantryItem, ShoppingListItem } from "../types";

interface PantryState {
  pantry: PantryItem[];
  shoppingList: ShoppingListItem[];
  leftovers: PantryItem[];
  addPantryItem: (item: Omit<PantryItem, "id" | "addedAt">) => void;
  updatePantryItem: (id: string, changes: Partial<PantryItem>) => void;
  removePantryItem: (id: string) => void;
  addToShoppingList: (item: Omit<ShoppingListItem, "id">) => void;
  toggleShoppingItem: (id: string) => void;
  clearShoppingList: () => void;
  markAsLeftover: (id: string) => void;
  consumeLeftover: (id: string) => void;
}

const defaultPantry: PantryItem[] = [
  {
    id: uuid(),
    name: "Кіноа",
    quantity: 0.5,
    unit: "кг",
    category: "grain",
    expiresAt: DateTime.now().plus({ months: 6 }).toISO(),
    addedAt: DateTime.now().minus({ days: 5 }).toISO(),
    pricePerUnit: 120
  },
  {
    id: uuid(),
    name: "Авокадо",
    quantity: 3,
    unit: "шт",
    category: "produce",
    expiresAt: DateTime.now().plus({ days: 3 }).toISO(),
    addedAt: DateTime.now().minus({ days: 1 }).toISO()
  },
  {
    id: uuid(),
    name: "Кокосове молоко",
    quantity: 2,
    unit: "банки",
    category: "dairy",
    expiresAt: DateTime.now().plus({ months: 2 }).toISO(),
    addedAt: DateTime.now().minus({ days: 12 }).toISO(),
    barcode: "8999991234567"
  }
];

export const usePantryStore = create<PantryState>()(
  persist(
    (set) => ({
      pantry: defaultPantry,
      shoppingList: [],
      leftovers: [],
      addPantryItem: (item) =>
        set((state) => ({
          pantry: [
            ...state.pantry,
            {
              ...item,
              id: uuid(),
              addedAt: DateTime.now().toISO()
            }
          ]
        })),
      updatePantryItem: (id, changes) =>
        set((state) => ({
          pantry: state.pantry.map((item) =>
            item.id === id
              ? {
                  ...item,
                  ...changes
                }
              : item
          )
        })),
      removePantryItem: (id) =>
        set((state) => ({
          pantry: state.pantry.filter((item) => item.id !== id),
          leftovers: state.leftovers.filter((item) => item.id !== id)
        })),
      addToShoppingList: (item) =>
        set((state) => ({
          shoppingList: [
            ...state.shoppingList,
            {
              ...item,
              id: uuid()
            }
          ]
        })),
      toggleShoppingItem: (id) =>
        set((state) => ({
          shoppingList: state.shoppingList.map((item) =>
            item.id === id
              ? {
                  ...item,
                  reason: item.reason === "missing" ? "suggested" : item.reason
                }
              : item
          )
        })),
      clearShoppingList: () => set({ shoppingList: [] }),
      markAsLeftover: (id) =>
        set((state) => {
          const item = state.pantry.find((pantryItem) => pantryItem.id === id);
          if (!item) return state;
          const leftover: PantryItem = {
            ...item,
            id: uuid(),
            addedAt: DateTime.now().toISO(),
            quantity: item.quantity / 2,
            expiresAt: DateTime.now().plus({ days: 2 }).toISO()
          };
          return {
            ...state,
            leftovers: [...state.leftovers, leftover]
          };
        }),
      consumeLeftover: (id) =>
        set((state) => ({
          leftovers: state.leftovers.filter((item) => item.id !== id)
        }))
    }),
    {
      name: "ai-smart-recipe-maker-pantry",
      storage: createJSONStorage(() => localStorage)
    }
  )
);
