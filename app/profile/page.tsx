'use client';

import { useState, useEffect } from 'react';
import { UserProfile, DietaryPreference } from '@/types';
import { storage, STORAGE_KEYS } from '@/utils/storage';
import { User, Mail, Target, AlertCircle, Award, TrendingUp } from 'lucide-react';

const DIETARY_OPTIONS: { value: DietaryPreference; label: string; emoji: string }[] = [
  { value: 'vegan', label: 'Веганське', emoji: '🌱' },
  { value: 'vegetarian', label: 'Вегетаріанське', emoji: '🥗' },
  { value: 'keto', label: 'Кето', emoji: '🥑' },
  { value: 'paleo', label: 'Палео', emoji: '🥩' },
  { value: 'glutenFree', label: 'Без глютену', emoji: '🌾' },
  { value: 'dairyFree', label: 'Без молочного', emoji: '🥛' },
  { value: 'lowCarb', label: 'Низько-вуглеводне', emoji: '📉' },
  { value: 'lowFat', label: 'Низько-жирове', emoji: '💪' },
];

const COMMON_ALLERGIES = [
  'Арахіс', 'Молоко', 'Яйця', 'Риба', 'Морепродукти', 
  'Соя', 'Пшениця', 'Горіхи', 'Кунжут'
];

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile>({
    id: 'user-1',
    name: '',
    email: '',
    allergies: [],
    dietaryPreferences: [],
    favoriteRecipes: [],
    cookingHistory: [],
    achievements: [],
    level: 1,
    points: 0,
  });

  const [allergyInput, setAllergyInput] = useState('');

  useEffect(() => {
    const savedProfile = storage.get<UserProfile | null>(STORAGE_KEYS.USER_PROFILE, null);
    if (savedProfile) {
      setProfile(savedProfile);
    }
  }, []);

  const handleSave = () => {
    storage.set(STORAGE_KEYS.USER_PROFILE, profile);
    alert('Профіль збережено!');
  };

  const toggleDietaryPreference = (pref: DietaryPreference) => {
    setProfile(prev => ({
      ...prev,
      dietaryPreferences: prev.dietaryPreferences.includes(pref)
        ? prev.dietaryPreferences.filter(p => p !== pref)
        : [...prev.dietaryPreferences, pref],
    }));
  };

  const addAllergy = (allergy: string) => {
    if (allergy && !profile.allergies.includes(allergy)) {
      setProfile(prev => ({
        ...prev,
        allergies: [...prev.allergies, allergy],
      }));
      setAllergyInput('');
    }
  };

  const removeAllergy = (allergy: string) => {
    setProfile(prev => ({
      ...prev,
      allergies: prev.allergies.filter(a => a !== allergy),
    }));
  };

  const currentLevelProgress = (profile.points % 100);
  const nextLevelPoints = 100;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-8 text-white mb-8">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center">
                <User className="w-12 h-12 text-orange-500" />
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2">
                  {profile.name || 'Мій профіль'}
                </h1>
                <div className="flex items-center gap-4 text-white/90">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    <span>Рівень {profile.level}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    <span>{profile.points} очок</span>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div
                      className="bg-white rounded-full h-2 transition-all"
                      style={{ width: `${(currentLevelProgress / nextLevelPoints) * 100}%` }}
                    />
                  </div>
                  <p className="text-sm mt-1 text-white/80">
                    {currentLevelProgress} / {nextLevelPoints} до наступного рівня
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Basic Info */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Основна інформація</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4 inline mr-2" />
                  Ім'я
                </label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  placeholder="Введіть ваше ім'я"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="w-4 h-4 inline mr-2" />
                  Email
                </label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                />
              </div>
            </div>
          </div>

          {/* Dietary Preferences */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              <Target className="w-6 h-6 inline mr-2" />
              Дієтичні уподобання
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {DIETARY_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => toggleDietaryPreference(option.value)}
                  className={`p-4 rounded-lg border-2 transition-all text-center ${
                    profile.dietaryPreferences.includes(option.value)
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-3xl mb-2">{option.emoji}</div>
                  <div className="text-sm font-medium text-gray-900">{option.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Allergies */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              <AlertCircle className="w-6 h-6 inline mr-2" />
              Алергії та обмеження
            </h2>
            
            <div className="mb-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={allergyInput}
                  onChange={(e) => setAllergyInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addAllergy(allergyInput)}
                  placeholder="Додати алергію..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                />
                <button
                  onClick={() => addAllergy(allergyInput)}
                  className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Додати
                </button>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Популярні алергени:</p>
              <div className="flex flex-wrap gap-2">
                {COMMON_ALLERGIES.map((allergy) => (
                  <button
                    key={allergy}
                    onClick={() => addAllergy(allergy)}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
                  >
                    {allergy}
                  </button>
                ))}
              </div>
            </div>

            {profile.allergies.length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Ваші алергії:</p>
                <div className="flex flex-wrap gap-2">
                  {profile.allergies.map((allergy) => (
                    <div
                      key={allergy}
                      className="flex items-center gap-2 bg-red-50 text-red-700 px-3 py-2 rounded-full text-sm"
                    >
                      <span>{allergy}</span>
                      <button
                        onClick={() => removeAllergy(allergy)}
                        className="hover:bg-red-200 rounded-full p-1 transition-colors"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Fitness Goals */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Фітнес-цілі</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Денна норма калорій
                </label>
                <input
                  type="number"
                  value={profile.fitnessGoals?.dailyCalories || ''}
                  onChange={(e) => setProfile({
                    ...profile,
                    fitnessGoals: {
                      ...profile.fitnessGoals,
                      dailyCalories: parseInt(e.target.value) || undefined,
                      goal: profile.fitnessGoals?.goal || 'general',
                    },
                  })}
                  placeholder="2000"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Денна норма білків (г)
                </label>
                <input
                  type="number"
                  value={profile.fitnessGoals?.dailyProtein || ''}
                  onChange={(e) => setProfile({
                    ...profile,
                    fitnessGoals: {
                      ...profile.fitnessGoals,
                      dailyProtein: parseInt(e.target.value) || undefined,
                      goal: profile.fitnessGoals?.goal || 'general',
                    },
                  })}
                  placeholder="50"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:from-orange-600 hover:to-red-600 transition-all"
          >
            Зберегти зміни
          </button>
        </div>
      </div>
    </div>
  );
}
