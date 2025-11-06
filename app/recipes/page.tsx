'use client';

import { useState, useEffect } from 'react';
import { Recipe } from '@/types';
import RecipeCard from '@/components/RecipeCard';
import { Search, Filter, TrendingUp } from 'lucide-react';

// Mock popular recipes
const POPULAR_RECIPES: Recipe[] = [
  {
    id: 'recipe-popular-1',
    title: 'Борщ український',
    description: 'Традиційний український борщ з м\'ясом та сметаною',
    imageUrl: 'https://source.unsplash.com/800x600/?borscht,soup',
    prepTime: 20,
    cookTime: 90,
    servings: 6,
    difficulty: 'medium',
    ingredients: [],
    steps: [],
    calories: 320,
    protein: 18,
    carbs: 28,
    fat: 15,
    tags: ['традиційне', 'обід', 'українське'],
    author: 'Chef Maria',
    rating: 4.8,
    reviews: [],
    createdAt: new Date(),
  },
  {
    id: 'recipe-popular-2',
    title: 'Вареники з картоплею',
    description: 'Домашні вареники з картопляною начинкою',
    imageUrl: 'https://source.unsplash.com/800x600/?dumplings,food',
    prepTime: 40,
    cookTime: 15,
    servings: 4,
    difficulty: 'medium',
    ingredients: [],
    steps: [],
    calories: 280,
    protein: 8,
    carbs: 45,
    fat: 8,
    tags: ['традиційне', 'українське', 'домашнє'],
    author: 'Chef Oksana',
    rating: 4.9,
    reviews: [],
    createdAt: new Date(),
  },
  {
    id: 'recipe-popular-3',
    title: 'Київський торт',
    description: 'Класичний київський торт з горіхами',
    imageUrl: 'https://source.unsplash.com/800x600/?cake,dessert',
    prepTime: 60,
    cookTime: 30,
    servings: 12,
    difficulty: 'hard',
    ingredients: [],
    steps: [],
    calories: 450,
    protein: 6,
    carbs: 52,
    fat: 24,
    tags: ['десерт', 'святковий', 'торт'],
    author: 'Pastry Chef Ivan',
    rating: 4.7,
    reviews: [],
    createdAt: new Date(),
  },
  {
    id: 'recipe-popular-4',
    title: 'Салат Олів\'є',
    description: 'Святковий салат з овочами та м\'ясом',
    imageUrl: 'https://source.unsplash.com/800x600/?salad,olivier',
    prepTime: 30,
    cookTime: 20,
    servings: 8,
    difficulty: 'easy',
    ingredients: [],
    steps: [],
    calories: 220,
    protein: 12,
    carbs: 18,
    fat: 12,
    tags: ['салат', 'святковий', 'закуска'],
    author: 'Chef Natalia',
    rating: 4.6,
    reviews: [],
    createdAt: new Date(),
  },
  {
    id: 'recipe-popular-5',
    title: 'Деруни',
    description: 'Хрусткі картопляні деруни зі сметаною',
    imageUrl: 'https://source.unsplash.com/800x600/?potato,pancake',
    prepTime: 15,
    cookTime: 20,
    servings: 4,
    difficulty: 'easy',
    ingredients: [],
    steps: [],
    calories: 240,
    protein: 6,
    carbs: 32,
    fat: 10,
    tags: ['швидко', 'картопля', 'традиційне'],
    author: 'Chef Lesya',
    rating: 4.5,
    reviews: [],
    createdAt: new Date(),
  },
  {
    id: 'recipe-popular-6',
    title: 'Голубці',
    description: 'Тушковані голубці з м\'ясом і рисом',
    imageUrl: 'https://source.unsplash.com/800x600/?cabbage,rolls',
    prepTime: 45,
    cookTime: 60,
    servings: 6,
    difficulty: 'medium',
    ingredients: [],
    steps: [],
    calories: 290,
    protein: 16,
    carbs: 24,
    fat: 14,
    tags: ['обід', 'вечеря', 'традиційне'],
    author: 'Chef Petro',
    rating: 4.7,
    reviews: [],
    createdAt: new Date(),
  },
];

export default function RecipesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [recipes, setRecipes] = useState<Recipe[]>(POPULAR_RECIPES);

  const filterRecipes = () => {
    let filtered = POPULAR_RECIPES;

    if (searchQuery) {
      filtered = filtered.filter(recipe =>
        recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (selectedFilter !== 'all') {
      filtered = filtered.filter(recipe => recipe.difficulty === selectedFilter);
    }

    setRecipes(filtered);
  };

  useEffect(() => {
    filterRecipes();
  }, [searchQuery, selectedFilter]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Популярні рецепти
          </h1>
          <p className="text-gray-600">
            Відкрийте для себе найкращі рецепти нашої спільноти
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Шукати рецепти..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
              />
            </div>

            {/* Difficulty Filter */}
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedFilter('all')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedFilter === 'all'
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Всі
              </button>
              <button
                onClick={() => setSelectedFilter('easy')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedFilter === 'easy'
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Легко
              </button>
              <button
                onClick={() => setSelectedFilter('medium')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedFilter === 'medium'
                    ? 'bg-yellow-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Середньо
              </button>
              <button
                onClick={() => setSelectedFilter('hard')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedFilter === 'hard'
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Складно
              </button>
            </div>
          </div>
        </div>

        {/* Recipes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>

        {/* Empty State */}
        {recipes.length === 0 && (
          <div className="text-center py-16">
            <Filter className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Рецептів не знайдено
            </h3>
            <p className="text-gray-500">
              Спробуйте змінити критерії пошуку
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
