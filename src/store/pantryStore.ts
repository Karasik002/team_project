import { create } from 'zustand';
import { nanoid } from '../utils/nanoid';
import { ExpiryAlert, PantryItem, ShoppingListItem } from '../types';
import { addDays, differenceInCalendarDays, isBefore } from '../utils/time';

type PantryState = {
  items: PantryItem[];
  shoppingList: ShoppingListItem[];
  alerts: ExpiryAlert[];
  addItemFromBarcode: (name: string, barcode: string) => void;
  addItem: (item: Omit<PantryItem, 'id'>) => void;
  consumeItem: (id: string, quantity?: number) => void;
  addToShoppingList: (ingredient: string, quantity: string, reason?: ShoppingListItem['reason']) => void;
  toggleShoppingItem: (id: string) => void;
  refreshAlerts: () => void;
};

const initialItems: PantryItem[] = [
  {
    id: nanoid('pantry'),
    name: 'Цвітна капуста',
    quantity: 1,
    unit: 'шт',
    category: 'овочі',
    expiresAt: addDays(new Date(), 3).toISOString(),
    storage: 'холодильник'
  },
  {
    id: nanoid('pantry'),
    name: 'Мигдальне молоко',
    quantity: 1,
    unit: 'л',
    category: 'молочні',
    expiresAt: addDays(new Date(), 5).toISOString(),
    storage: 'холодильник'
  },
  {
    id: nanoid('pantry'),
    name: 'Чіа',
    quantity: 300,
    unit: 'г',
    category: 'бакалія',
    expiresAt: addDays(new Date(), 120).toISOString(),
    storage: 'кімнатна температура'
  }
];

const createAlertList = (items: PantryItem[]): ExpiryAlert[] =>
  items
    .map((item) => {
      const days = differenceInCalendarDays(new Date(item.expiresAt), new Date());
      return {
        itemId: item.id,
        name: item.name,
        expiresInDays: days
      } satisfies ExpiryAlert;
    })
    .filter((alert) => alert.expiresInDays <= 3)
    .sort((a, b) => a.expiresInDays - b.expiresInDays);

export const usePantryStore = create<PantryState>((set, get) => ({
  items: initialItems,
  shoppingList: [],
  alerts: createAlertList(initialItems),
  addItemFromBarcode: (name, barcode) => {
    const newItem: PantryItem = {
      id: nanoid('pantry'),
      name,
      barcode,
      quantity: 1,
      unit: 'шт',
      category: 'інші',
      expiresAt: addDays(new Date(), 7).toISOString(),
      storage: 'кімнатна температура'
    };
    set((state) => {
      const items = [...state.items, newItem];
      return {
        items,
        alerts: createAlertList(items)
      };
    });
  },
  addItem: (item) =>
    set((state) => {
      const items = [...state.items, { id: nanoid('pantry'), ...item }];
      return {
        items,
        alerts: createAlertList(items)
      };
    }),
  consumeItem: (id, quantity = 1) =>
    set((state) => {
      const items = state.items
        .map((item) =>
          item.id === id
            ? { ...item, quantity: Math.max(item.quantity - quantity, 0) }
            : item
        )
        .filter((item) => item.quantity > 0);
      return {
        items,
        alerts: createAlertList(items)
      };
    }),
  addToShoppingList: (ingredient, quantity, reason = 'бракує') =>
    set((state) => ({
      shoppingList: [
        ...state.shoppingList,
        {
          id: nanoid('shopping'),
          ingredient,
          quantity,
          addedAt: new Date().toISOString(),
          reason,
          checked: false
        }
      ]
    })),
  toggleShoppingItem: (id) =>
    set((state) => ({
      shoppingList: state.shoppingList.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    })),
  refreshAlerts: () => {
    const items = get().items;
    set({ alerts: createAlertList(items) });
    items
      .filter((item) => isBefore(new Date(item.expiresAt), new Date()))
      .forEach((item) => {
        get().addToShoppingList(item.name, `${item.quantity} ${item.unit}`, 'авто-поповнення');
      });
  }
}));
