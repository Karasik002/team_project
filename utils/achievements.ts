import { Achievement, CookingHistory } from '@/types';

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-recipe',
    name: 'Перший рецепт',
    description: 'Приготуйте свою першу страву',
    icon: '🍳',
    maxProgress: 1,
  },
  {
    id: 'chef-novice',
    name: 'Новачок-кухар',
    description: 'Приготуйте 5 різних страв',
    icon: '👨‍🍳',
    maxProgress: 5,
  },
  {
    id: 'master-chef',
    name: 'Майстер-кухар',
    description: 'Приготуйте 25 різних страв',
    icon: '⭐',
    maxProgress: 25,
  },
  {
    id: 'healthy-eater',
    name: 'Здоровий спосіб життя',
    description: 'Приготуйте 10 здорових страв',
    icon: '🥗',
    maxProgress: 10,
  },
  {
    id: 'speed-cook',
    name: 'Швидкий кухар',
    description: 'Приготуйте 5 швидких страв (до 15 хвилин)',
    icon: '⚡',
    maxProgress: 5,
  },
  {
    id: 'vegan-warrior',
    name: 'Веган-воїн',
    description: 'Приготуйте 10 веганських страв',
    icon: '🌱',
    maxProgress: 10,
  },
  {
    id: 'dessert-lover',
    name: 'Любитель десертів',
    description: 'Приготуйте 5 десертів',
    icon: '🍰',
    maxProgress: 5,
  },
  {
    id: 'week-streak',
    name: 'Тижневий марафон',
    description: 'Готуйте щодня протягом тижня',
    icon: '🔥',
    maxProgress: 7,
  },
];

export function checkAchievements(
  cookingHistory: CookingHistory[],
  currentAchievements: Achievement[]
): Achievement[] {
  const updated = [...currentAchievements];

  // First recipe
  if (cookingHistory.length >= 1) {
    unlockAchievement(updated, 'first-recipe', 1);
  }

  // Chef novice
  if (cookingHistory.length >= 5) {
    unlockAchievement(updated, 'chef-novice', cookingHistory.length);
  }

  // Master chef
  if (cookingHistory.length >= 25) {
    unlockAchievement(updated, 'master-chef', cookingHistory.length);
  }

  return updated;
}

function unlockAchievement(
  achievements: Achievement[],
  id: string,
  progress: number
): void {
  const achievement = achievements.find(a => a.id === id);
  if (achievement) {
    achievement.progress = progress;
    if (!achievement.unlockedAt && progress >= (achievement.maxProgress || 1)) {
      achievement.unlockedAt = new Date();
    }
  }
}

export function calculateLevel(points: number): number {
  return Math.floor(points / 100) + 1;
}

export function getPointsForNextLevel(currentLevel: number): number {
  return currentLevel * 100;
}
