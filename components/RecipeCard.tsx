'use client';

import { Recipe } from '@/types';
import { Clock, Users, Star, Flame, Heart } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

interface Props {
  recipe: Recipe;
}

export default function RecipeCard({ recipe }: Props) {
  const [isFavorite, setIsFavorite] = useState(false);

  const totalTime = recipe.prepTime + recipe.cookTime;
  const difficultyColors = {
    easy: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    hard: 'bg-red-100 text-red-800',
  };

  const difficultyLabels = {
    easy: 'Легко',
    medium: 'Середньо',
    hard: 'Складно',
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
      {/* Image */}
      <div className="relative h-48 bg-gray-200 overflow-hidden">
        <img
          src={recipe.imageUrl}
          alt={recipe.title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
        <button
          onClick={() => setIsFavorite(!isFavorite)}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition-colors ${
            isFavorite
              ? 'bg-red-500 text-white'
              : 'bg-white/80 text-gray-600 hover:bg-white'
          }`}
        >
          <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
        </button>
        <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-sm font-medium ${difficultyColors[recipe.difficulty]}`}>
          {difficultyLabels[recipe.difficulty]}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
          {recipe.title}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {recipe.description}
        </p>

        {/* Meta Info */}
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{totalTime} хв</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{recipe.servings} порції</span>
          </div>
          <div className="flex items-center gap-1">
            <Flame className="w-4 h-4" />
            <span>{recipe.calories} ккал</span>
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(recipe.rating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600">
            {recipe.rating.toFixed(1)}
          </span>
        </div>

        {/* Nutrition Info */}
        <div className="grid grid-cols-3 gap-2 mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="text-center">
            <div className="text-xs text-gray-600">Білки</div>
            <div className="text-sm font-semibold text-gray-900">{recipe.protein}г</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-600">Жири</div>
            <div className="text-sm font-semibold text-gray-900">{recipe.fat}г</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-600">Вуглеводи</div>
            <div className="text-sm font-semibold text-gray-900">{recipe.carbs}г</div>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {recipe.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-orange-50 text-orange-700 text-xs rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Action Button */}
        <Link
          href={`/recipes/${recipe.id}`}
          className="block w-full text-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
        >
          Переглянути рецепт
        </Link>
      </div>
    </div>
  );
}
