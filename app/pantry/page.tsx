'use client';

import { useState, useEffect } from 'react';
import { Ingredient } from '@/types';
import { storage, STORAGE_KEYS } from '@/utils/storage';
import { Plus, X, Calendar, Barcode, AlertTriangle } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { uk } from 'date-fns/locale';

export default function PantryPage() {
  const [pantry, setPantry] = useState<Ingredient[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '',
    quantity: 1,
    unit: 'шт',
    expirationDate: '',
    category: 'Інше',
  });

  useEffect(() => {
    const savedPantry = storage.get<Ingredient[]>(STORAGE_KEYS.PANTRY, []);
    setPantry(savedPantry);
  }, []);

  const savePantry = (updatedPantry: Ingredient[]) => {
    setPantry(updatedPantry);
    storage.set(STORAGE_KEYS.PANTRY, updatedPantry);
  };

  const handleAddItem = () => {
    if (!newItem.name) return;

    const ingredient: Ingredient = {
      id: `pantry-${Date.now()}`,
      name: newItem.name,
      quantity: newItem.quantity,
      unit: newItem.unit,
      expirationDate: newItem.expirationDate ? new Date(newItem.expirationDate) : undefined,
      category: newItem.category,
    };

    savePantry([...pantry, ingredient]);
    setNewItem({ name: '', quantity: 1, unit: 'шт', expirationDate: '', category: 'Інше' });
    setShowAddModal(false);
  };

  const handleRemoveItem = (id: string) => {
    savePantry(pantry.filter(item => item.id !== id));
  };

  const getExpirationStatus = (expirationDate?: Date) => {
    if (!expirationDate) return null;
    
    const days = differenceInDays(expirationDate, new Date());
    
    if (days < 0) {
      return { label: 'Протерміновано', color: 'bg-red-100 text-red-800', priority: 3 };
    } else if (days <= 3) {
      return { label: `${days} днів`, color: 'bg-orange-100 text-orange-800', priority: 2 };
    } else if (days <= 7) {
      return { label: `${days} днів`, color: 'bg-yellow-100 text-yellow-800', priority: 1 };
    }
    return { label: `${days} днів`, color: 'bg-green-100 text-green-800', priority: 0 };
  };

  const groupedPantry = pantry.reduce((acc, item) => {
    const category = item.category || 'Інше';
    if (!acc[category]) acc[category] = [];
    acc[category].push(item);
    return acc;
  }, {} as Record<string, Ingredient[]>);

  const expiringItems = pantry
    .filter(item => {
      const status = getExpirationStatus(item.expirationDate);
      return status && status.priority >= 2;
    })
    .sort((a, b) => {
      const statusA = getExpirationStatus(a.expirationDate);
      const statusB = getExpirationStatus(b.expirationDate);
      return (statusB?.priority || 0) - (statusA?.priority || 0);
    });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Моя комора</h1>
              <p className="text-gray-600">Керуйте продуктами та відстежуйте терміни придатності</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Додати продукт
            </button>
          </div>

          {/* Expiring Soon Alert */}
          {expiringItems.length > 0 && (
            <div className="bg-orange-50 border-l-4 border-orange-500 p-4 mb-6 rounded-r-lg">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 text-orange-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold text-orange-900 mb-2">
                    Увага! Продукти з обмеженим терміном придатності
                  </h3>
                  <div className="space-y-1">
                    {expiringItems.slice(0, 3).map(item => {
                      const status = getExpirationStatus(item.expirationDate);
                      return (
                        <div key={item.id} className="text-sm text-orange-800">
                          • {item.name} - {status?.label}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Pantry Items */}
          {Object.keys(groupedPantry).length > 0 ? (
            <div className="space-y-6">
              {Object.entries(groupedPantry).map(([category, items]) => (
                <div key={category} className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">{category}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {items.map((item) => {
                      const expirationStatus = getExpirationStatus(item.expirationDate);
                      
                      return (
                        <div
                          key={item.id}
                          className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900">{item.name}</h3>
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
                          
                          {item.expirationDate && expirationStatus && (
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              <span className={`text-xs px-2 py-1 rounded-full ${expirationStatus.color}`}>
                                {expirationStatus.label}
                              </span>
                            </div>
                          )}

                          {item.barcode && (
                            <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                              <Barcode className="w-4 h-4" />
                              {item.barcode}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <div className="text-6xl mb-4">🥘</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                Ваша комора порожня
              </h3>
              <p className="text-gray-500 mb-6">
                Додайте продукти, щоб відстежувати їх залишки та терміни придатності
              </p>
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors inline-flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Додати перший продукт
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Add Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Додати продукт</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Назва продукту
                </label>
                <input
                  type="text"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  placeholder="Наприклад: Молоко"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Кількість
                  </label>
                  <input
                    type="number"
                    value={newItem.quantity}
                    onChange={(e) => setNewItem({ ...newItem, quantity: parseFloat(e.target.value) })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Одиниця
                  </label>
                  <select
                    value={newItem.unit}
                    onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  >
                    <option>шт</option>
                    <option>кг</option>
                    <option>г</option>
                    <option>л</option>
                    <option>мл</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Категорія
                </label>
                <select
                  value={newItem.category}
                  onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                >
                  <option>Молочні продукти</option>
                  <option>М'ясо та риба</option>
                  <option>Овочі</option>
                  <option>Фрукти</option>
                  <option>Крупи та макарони</option>
                  <option>Спеції</option>
                  <option>Інше</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Термін придатності
                </label>
                <input
                  type="date"
                  value={newItem.expirationDate}
                  onChange={(e) => setNewItem({ ...newItem, expirationDate: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Скасувати
              </button>
              <button
                onClick={handleAddItem}
                className="flex-1 px-4 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                Додати
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
