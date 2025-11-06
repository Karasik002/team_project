'use client';

import { useState, useEffect } from 'react';
import { Ingredient, Recipe, UserProfile } from '@/types';
import { generateRecipes } from '@/utils/recipeGenerator';
import { storage, STORAGE_KEYS } from '@/utils/storage';
import IngredientInput from '@/components/IngredientInput';
import RecipeCard from '@/components/RecipeCard';
import { ChefHat, Sparkles } from 'lucide-react';

export default function Home() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    // Load user profile from storage
    const profile = storage.get<UserProfile | null>(STORAGE_KEYS.USER_PROFILE, null);
    setUserProfile(profile);
  }, []);

  const handleGenerateRecipes = async () => {
    if (ingredients.length === 0) return;

    setIsGenerating(true);
    
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const generatedRecipes = generateRecipes(
      ingredients,
      userProfile?.dietaryPreferences || [],
      userProfile?.allergies || []
    );
    
    setRecipes(generatedRecipes);
    setIsGenerating(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-red-500/10" />
        <div className="container mx-auto px-4 py-16 relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex items-center justify-center mb-6">
              <ChefHat className="w-16 h-16 text-orange-600" />
              <Sparkles className="w-8 h-8 text-yellow-500 absolute ml-12 -mt-8 animate-pulse" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              AI Smart Recipe Maker
            </h1>
            <p className="text-xl text-gray-700 mb-8">
              Розумний кулінарний асистент, який створює унікальні рецепти на основі ваших інгредієнтів
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
              <span className="bg-white px-4 py-2 rounded-full shadow-sm">🎯 Персоналізовані рецепти</span>
              <span className="bg-white px-4 py-2 rounded-full shadow-sm">🥗 Відстеження калорій</span>
              <span className="bg-white px-4 py-2 rounded-full shadow-sm">🎮 Досягнення</span>
              <span className="bg-white px-4 py-2 rounded-full shadow-sm">🎤 Голосове управління</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Ingredient Input */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Що у вас є на кухні?
            </h2>
            <IngredientInput
              ingredients={ingredients}
              onIngredientsChange={setIngredients}
            />
            
            {ingredients.length > 0 && (
              <button
                onClick={handleGenerateRecipes}
                disabled={isGenerating}
                className="mt-6 w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 px-8 rounded-xl font-semibold text-lg hover:from-orange-600 hover:to-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white" />
                    Генеруємо рецепти...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-6 h-6" />
                    Згенерувати рецепти
                  </>
                )}
              </button>
            )}
          </div>

          {/* Generated Recipes */}
          {recipes.length > 0 && (
            <div className="animate-fadeIn">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                Ваші персональні рецепти ({recipes.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recipes.map((recipe) => (
                  <RecipeCard key={recipe.id} recipe={recipe} />
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {recipes.length === 0 && !isGenerating && ingredients.length === 0 && (
            <div className="text-center py-16">
              <ChefHat className="w-24 h-24 text-gray-300 mx-auto mb-6" />
              <h3 className="text-2xl font-semibold text-gray-600 mb-3">
                Почніть свою кулінарну подорож
              </h3>
              <p className="text-gray-500 max-w-md mx-auto">
                Додайте інгредієнти, які є у вас вдома, і наш AI створить для вас унікальні рецепти
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Можливості платформи
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <FeatureCard
              icon="🎯"
              title="Персоналізація"
              description="Рецепти адаптуються під ваші алергії, дієту та уподобання"
            />
            <FeatureCard
              icon="📊"
              title="Калькулятор БЖВ"
              description="Детальний розрахунок калорій, білків, жирів та вуглеводів"
            />
            <FeatureCard
              icon="🛒"
              title="Список покупок"
              description="Автоматичне формування списку відсутніх інгредієнтів"
            />
            <FeatureCard
              icon="🏆"
              title="Досягнення"
              description="Отримуйте нагороди за кулінарні успіхи"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="text-center p-6 rounded-xl hover:bg-gray-50 transition-colors">
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
