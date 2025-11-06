'use client';

import { useState, useEffect } from 'react';
import { Achievement, Challenge, UserProfile } from '@/types';
import { storage, STORAGE_KEYS } from '@/utils/storage';
import { ACHIEVEMENTS } from '@/utils/achievements';
import { Trophy, Target, Lock, CheckCircle, Clock } from 'lucide-react';

const CHALLENGES: Challenge[] = [
  {
    id: 'challenge-1',
    title: 'Тиждень здорового харчування',
    description: 'Приготуйте 7 здорових страв за тиждень',
    difficulty: 'medium',
    reward: 200,
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    requirements: ['Низька калорійність', 'Овочі', 'Білки'],
    completed: false,
  },
  {
    id: 'challenge-2',
    title: 'Швидкий кухар',
    description: 'Приготуйте 5 страв за 20 хвилин',
    difficulty: 'easy',
    reward: 100,
    requirements: ['Час приготування < 20 хв'],
    completed: false,
  },
  {
    id: 'challenge-3',
    title: 'Майстер десертів',
    description: 'Приготуйте 3 різні десерти',
    difficulty: 'hard',
    reward: 300,
    requirements: ['Десерти', 'Високий рейтинг'],
    completed: false,
  },
];

export default function AchievementsPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>(ACHIEVEMENTS);
  const [selectedTab, setSelectedTab] = useState<'achievements' | 'challenges'>('achievements');

  useEffect(() => {
    const savedProfile = storage.get<UserProfile | null>(STORAGE_KEYS.USER_PROFILE, null);
    setProfile(savedProfile);

    if (savedProfile?.achievements) {
      // Merge saved achievements with template
      const merged = ACHIEVEMENTS.map(template => {
        const saved = savedProfile.achievements.find(a => a.id === template.id);
        return saved || template;
      });
      setAchievements(merged);
    }
  }, []);

  const unlockedAchievements = achievements.filter(a => a.unlockedAt);
  const lockedAchievements = achievements.filter(a => !a.unlockedAt);
  const completionRate = achievements.length > 0
    ? Math.round((unlockedAchievements.length / achievements.length) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Досягнення і виклики
            </h1>
            <p className="text-gray-600">
              Відкривайте нові досягнення та виконуйте кулінарні виклики
            </p>
          </div>

          {/* Stats Card */}
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-6 text-white mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Trophy className="w-6 h-6" />
                  <span className="text-white/90">Рівень</span>
                </div>
                <div className="text-3xl font-bold">{profile?.level || 1}</div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-6 h-6" />
                  <span className="text-white/90">Відкрито</span>
                </div>
                <div className="text-3xl font-bold">
                  {unlockedAchievements.length} / {achievements.length}
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-6 h-6" />
                  <span className="text-white/90">Прогрес</span>
                </div>
                <div className="text-3xl font-bold">{completionRate}%</div>
              </div>
            </div>
            <div className="mt-4">
              <div className="w-full bg-white/20 rounded-full h-2">
                <div
                  className="bg-white rounded-full h-2 transition-all"
                  style={{ width: `${completionRate}%` }}
                />
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setSelectedTab('achievements')}
              className={`flex-1 py-3 px-6 rounded-lg font-medium transition-colors ${
                selectedTab === 'achievements'
                  ? 'bg-orange-500 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Trophy className="w-5 h-5 inline mr-2" />
              Досягнення
            </button>
            <button
              onClick={() => setSelectedTab('challenges')}
              className={`flex-1 py-3 px-6 rounded-lg font-medium transition-colors ${
                selectedTab === 'challenges'
                  ? 'bg-orange-500 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Target className="w-5 h-5 inline mr-2" />
              Виклики
            </button>
          </div>

          {/* Content */}
          {selectedTab === 'achievements' ? (
            <div className="space-y-6">
              {/* Unlocked Achievements */}
              {unlockedAchievements.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Відкриті досягнення
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {unlockedAchievements.map((achievement) => (
                      <AchievementCard
                        key={achievement.id}
                        achievement={achievement}
                        unlocked
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Locked Achievements */}
              {lockedAchievements.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Заблоковані досягнення
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {lockedAchievements.map((achievement) => (
                      <AchievementCard
                        key={achievement.id}
                        achievement={achievement}
                        unlocked={false}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Активні виклики
              </h2>
              {CHALLENGES.map((challenge) => (
                <ChallengeCard key={challenge.id} challenge={challenge} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function AchievementCard({ achievement, unlocked }: { achievement: Achievement; unlocked: boolean }) {
  const progress = achievement.progress || 0;
  const maxProgress = achievement.maxProgress || 1;
  const progressPercentage = (progress / maxProgress) * 100;

  return (
    <div
      className={`relative rounded-xl p-6 transition-all ${
        unlocked
          ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-300'
          : 'bg-white border-2 border-gray-200 opacity-75'
      }`}
    >
      {!unlocked && (
        <div className="absolute top-4 right-4">
          <Lock className="w-5 h-5 text-gray-400" />
        </div>
      )}

      <div className="text-center mb-4">
        <div className={`text-5xl mb-3 ${!unlocked && 'grayscale'}`}>
          {achievement.icon}
        </div>
        <h3 className="font-bold text-gray-900 mb-1">{achievement.name}</h3>
        <p className="text-sm text-gray-600">{achievement.description}</p>
      </div>

      {achievement.maxProgress && achievement.maxProgress > 1 && (
        <div>
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>Прогрес</span>
            <span>{progress} / {maxProgress}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${
                unlocked ? 'bg-green-500' : 'bg-gray-400'
              }`}
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      )}

      {unlocked && achievement.unlockedAt && (
        <div className="mt-3 text-xs text-gray-500 text-center">
          Відкрито: {new Date(achievement.unlockedAt).toLocaleDateString('uk-UA')}
        </div>
      )}
    </div>
  );
}

function ChallengeCard({ challenge }: { challenge: Challenge }) {
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
    <div className="bg-white rounded-xl border-2 border-gray-200 p-6 hover:border-orange-300 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-xl font-bold text-gray-900">{challenge.title}</h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${difficultyColors[challenge.difficulty]}`}>
              {difficultyLabels[challenge.difficulty]}
            </span>
          </div>
          <p className="text-gray-600">{challenge.description}</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-orange-600">+{challenge.reward}</div>
          <div className="text-xs text-gray-600">очок</div>
        </div>
      </div>

      {challenge.deadline && (
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
          <Clock className="w-4 h-4" />
          <span>Закінчується: {challenge.deadline.toLocaleDateString('uk-UA')}</span>
        </div>
      )}

      <div className="mb-4">
        <p className="text-sm font-medium text-gray-700 mb-2">Вимоги:</p>
        <div className="flex flex-wrap gap-2">
          {challenge.requirements.map((req, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
            >
              {req}
            </span>
          ))}
        </div>
      </div>

      <button
        disabled={challenge.completed}
        className={`w-full py-3 rounded-lg font-medium transition-colors ${
          challenge.completed
            ? 'bg-green-100 text-green-800 cursor-not-allowed'
            : 'bg-orange-500 text-white hover:bg-orange-600'
        }`}
      >
        {challenge.completed ? (
          <>
            <CheckCircle className="w-5 h-5 inline mr-2" />
            Виконано
          </>
        ) : (
          'Почати виклик'
        )}
      </button>
    </div>
  );
}
