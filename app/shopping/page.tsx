'use client';

import { useState, useEffect } from 'react';
import { ShoppingList, ShoppingItem } from '@/types';
import { storage, STORAGE_KEYS } from '@/utils/storage';
import { Plus, X, Check, ShoppingCart, Barcode } from 'lucide-react';

export default function ShoppingPage() {
  const [shoppingList, setShoppingList] = useState<ShoppingList>({
    id: 'list-1',
    items: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  const [newItemName, setNewItemName] = useState('');
  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false);

  useEffect(() => {
    const savedList = storage.get<ShoppingList | null>(STORAGE_KEYS.SHOPPING_LIST, null);
    if (savedList) {
      setShoppingList(savedList);
    }
  }, []);

  const saveList = (updatedList: ShoppingList) => {
    const listToSave = { ...updatedList, updatedAt: new Date() };
    setShoppingList(listToSave);
    storage.set(STORAGE_KEYS.SHOPPING_LIST, listToSave);
  };

  const handleAddItem = () => {
    if (!newItemName.trim()) return;

    const newItem: ShoppingItem = {
      id: `item-${Date.now()}`,
      name: newItemName.trim(),
      quantity: 1,
      unit: 'шт',
      category: 'Інше',
      purchased: false,
    };

    saveList({
      ...shoppingList,
      items: [...shoppingList.items, newItem],
    });
    setNewItemName('');
  };

  const handleToggleItem = (id: string) => {
    saveList({
      ...shoppingList,
      items: shoppingList.items.map(item =>
        item.id === id ? { ...item, purchased: !item.purchased } : item
      ),
    });
  };

  const handleRemoveItem = (id: string) => {
    saveList({
      ...shoppingList,
      items: shoppingList.items.filter(item => item.id !== id),
    });
  };

  const handleClearPurchased = () => {
    saveList({
      ...shoppingList,
      items: shoppingList.items.filter(item => !item.purchased),
    });
  };

  const groupedItems = shoppingList.items.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, ShoppingItem[]>);

  const totalItems = shoppingList.items.length;
  const purchasedItems = shoppingList.items.filter(item => item.purchased).length;
  const progressPercentage = totalItems > 0 ? (purchasedItems / totalItems) * 100 : 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Список покупок
            </h1>
            <p className="text-gray-600">
              Керуйте своїм списком покупок та відстежуйте прогрес
            </p>
          </div>

          {/* Progress Card */}
          {totalItems > 0 && (
            <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-6 text-white mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold">{purchasedItems} / {totalItems}</h2>
                  <p className="text-white/90">товарів куплено</p>
                </div>
                <ShoppingCart className="w-12 h-12 opacity-80" />
              </div>
              <div className="w-full bg-white/20 rounded-full h-3">
                <div
                  className="bg-white rounded-full h-3 transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          )}

          {/* Add Item */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <div className="flex gap-2">
              <input
                type="text"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddItem()}
                placeholder="Додати продукт до списку..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
              />
              <button
                onClick={() => setShowBarcodeScanner(!showBarcodeScanner)}
                className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                title="Сканувати штрих-код"
              >
                <Barcode className="w-5 h-5 text-gray-600" />
              </button>
              <button
                onClick={handleAddItem}
                className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Додати
              </button>
            </div>

            {showBarcodeScanner && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800 mb-2">
                  📸 Сканування штрих-коду
                </p>
                <p className="text-xs text-blue-600">
                  У повній версії тут буде камера для сканування штрих-кодів продуктів
                </p>
              </div>
            )}

            {/* Quick Add */}
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">Популярні продукти:</p>
              <div className="flex flex-wrap gap-2">
                {['Молоко', 'Хліб', 'Яйця', 'Масло', 'Сир', 'Овочі', 'Фрукти', 'М\'ясо'].map((item) => (
                  <button
                    key={item}
                    onClick={() => {
                      setNewItemName(item);
                      setTimeout(handleAddItem, 100);
                    }}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
                  >
                    + {item}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Shopping List */}
          {totalItems > 0 ? (
            <div className="space-y-6">
              {Object.entries(groupedItems).map(([category, items]) => (
                <div key={category} className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">{category}</h3>
                  <div className="space-y-2">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${
                          item.purchased
                            ? 'border-green-200 bg-green-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <button
                          onClick={() => handleToggleItem(item.id)}
                          className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                            item.purchased
                              ? 'bg-green-500 border-green-500'
                              : 'border-gray-300 hover:border-green-500'
                          }`}
                        >
                          {item.purchased && <Check className="w-4 h-4 text-white" />}
                        </button>
                        
                        <div className="flex-1">
                          <p className={`font-medium ${item.purchased ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                            {item.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            {item.quantity} {item.unit}
                          </p>
                        </div>

                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* Clear Purchased Button */}
              {purchasedItems > 0 && (
                <button
                  onClick={handleClearPurchased}
                  className="w-full py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
                >
                  Очистити куплені товари ({purchasedItems})
                </button>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                Ваш список покупок порожній
              </h3>
              <p className="text-gray-500">
                Додайте продукти, які потрібно купити
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
