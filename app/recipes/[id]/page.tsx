'use client';

import { useState, useEffect } from 'react';
import { Recipe, CookingHistory } from '@/types';
import { Clock, Users, Flame, Star, Play, Share2, Bookmark, ChefHat } from 'lucide-react';
import { storage, STORAGE_KEYS } from '@/utils/storage';
import { useRouter } from 'next/navigation';

export default function RecipeDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [isKitchenMode, setIsKitchenMode] = useState(false);

  useEffect(() => {
    // Mock recipe data - in production would fetch from API
    const mockRecipe: Recipe = {
      id: params.id,
      title: 'Український борщ',
      description: 'Традиційний український борщ з м\'ясом, овочами та сметаною',
      imageUrl: 'https://source.unsplash.com/1200x600/?borscht,soup',
      videoUrl: 'https://example.com/video/borscht',
      prepTime: 20,
      cookTime: 90,
      servings: 6,
      difficulty: 'medium',
      ingredients: [
        { name: 'Яловичина', quantity: 500, unit: 'г' },
        { name: 'Буряк', quantity: 2, unit: 'шт' },
        { name: 'Картопля', quantity: 3, unit: 'шт' },
        { name: 'Капуста', quantity: 300, unit: 'г' },
        { name: 'Морква', quantity: 1, unit: 'шт' },
        { name: 'Цибуля', quantity: 1, unit: 'шт' },
        { name: 'Часник', quantity: 3, unit: 'зубчики' },
        { name: 'Томатна паста', quantity: 2, unit: 'ст.л.' },
        { name: 'Сметана', quantity: 200, unit: 'г' },
        { name: 'Кріп', quantity: 1, unit: 'пучок' },
      ],
      steps: [
        'Поріжте яловичину на середні шматки і поставте варитись в холодній воді на 1,5 години',
        'Наріжте буряк соломкою і протушкуйте з томатною пастою 10 хвилин',
        'Поріжте картоплю кубиками і додайте в бульйон',
        'Нашинкуйте капусту і додайте до каструлі',
        'Обсмажте моркву і цибулю до золотистого кольору',
        'Додайте зажарку і буряк в каструлю',
        'Приправте сіллю, перцем і часником',
        'Варіть ще 15 хвилин і дайте настоятись',
        'Подавайте зі сметаною та кропом',
      ],
      calories: 320,
      protein: 18,
      carbs: 28,
      fat: 15,
      tags: ['українське', 'супи', 'традиційне'],
      author: 'AI Chef',
      rating: 4.8,
      reviews: [],
      createdAt: new Date(),
    };

    setRecipe(mockRecipe);
  }, [params.id]);

  const handleStartCooking = () => {
    if (!recipe) return;

    // Save to cooking history
    const history = storage.get<CookingHistory[]>(STORAGE_KEYS.COOKING_HISTORY, []);
    history.push({
      recipeId: recipe.id,
      recipeName: recipe.title,
      cookedAt: new Date(),
    });
    storage.set(STORAGE_KEYS.COOKING_HISTORY, history);

    setIsKitchenMode(true);
  };

  const speakStep = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'uk-UA';
      window.speechSynthesis.speak(utterance);
    }
  };

  if (!recipe) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500" />
      </div>
    );
  }

  const totalTime = recipe.prepTime + recipe.cookTime;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Image */}
      <div className="relative h-96 bg-gray-900">
        <img
          src={recipe.imageUrl}
          alt={recipe.title}
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="container mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {recipe.title}
            </h1>
            <div className="flex flex-wrap gap-4 text-white">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>{totalTime} хвилин</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                <span>{recipe.servings} порцій</span>
              </div>
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5" />
                <span>{recipe.calories} ккал</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span>{recipe.rating.toFixed(1)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Description */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Опис</h2>
              <p className="text-gray-600">{recipe.description}</p>
            </div>

            {/* Ingredients */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Інгредієнти ({recipe.ingredients.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {recipe.ingredients.map((ingredient, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-semibold">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{ingredient.name}</div>
                      <div className="text-sm text-gray-600">
                        {ingredient.quantity} {ingredient.unit}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Steps */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Інструкція приготування
              </h2>
              <div className="space-y-4">
                {recipe.steps.map((step, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border-2 transition-colors ${
                      isKitchenMode && activeStep === index
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-gray-200 bg-white'
                    }`}
                  >
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-10 h-10 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-900">{step}</p>
                        {isKitchenMode && activeStep === index && (
                          <button
                            onClick={() => speakStep(step)}
                            className="mt-2 text-orange-600 hover:text-orange-700 text-sm flex items-center gap-2"
                          >
                            <Play className="w-4 h-4" />
                            Озвучити крок
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {isKitchenMode && (
                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
                    disabled={activeStep === 0}
                    className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Попередній крок
                  </button>
                  <button
                    onClick={() => setActiveStep(Math.min(recipe.steps.length - 1, activeStep + 1))}
                    disabled={activeStep === recipe.steps.length - 1}
                    className="flex-1 px-4 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Наступний крок
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Actions */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6 sticky top-4">
              <button
                onClick={handleStartCooking}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:from-orange-600 hover:to-red-600 transition-all flex items-center justify-center gap-2 mb-3"
              >
                <ChefHat className="w-6 h-6" />
                {isKitchenMode ? 'Режим кухаря активний' : 'Почати готувати'}
              </button>

              <div className="grid grid-cols-3 gap-2">
                <button className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex flex-col items-center gap-1">
                  <Bookmark className="w-5 h-5 text-gray-600" />
                  <span className="text-xs text-gray-600">Зберегти</span>
                </button>
                <button className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex flex-col items-center gap-1">
                  <Share2 className="w-5 h-5 text-gray-600" />
                  <span className="text-xs text-gray-600">Поділитись</span>
                </button>
                <button className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex flex-col items-center gap-1">
                  <Play className="w-5 h-5 text-gray-600" />
                  <span className="text-xs text-gray-600">Відео</span>
                </button>
              </div>
            </div>

            {/* Nutrition */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Харчова цінність (на порцію)
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Калорії</span>
                  <span className="font-semibold text-gray-900">{recipe.calories} ккал</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Білки</span>
                  <span className="font-semibold text-gray-900">{recipe.protein} г</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Жири</span>
                  <span className="font-semibold text-gray-900">{recipe.fat} г</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Вуглеводи</span>
                  <span className="font-semibold text-gray-900">{recipe.carbs} г</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
