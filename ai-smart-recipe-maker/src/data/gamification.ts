import type { Achievement, CulinaryChallenge } from '../types'

export const defaultAchievements: Achievement[] = [
  {
    id: 'first-recipe',
    title: 'Перший шедевр',
    description: 'Згенеруйте та приготуйте свій перший рецепт за допомогою AI.',
    icon: 'sparkles',
    progress: 1,
    goal: 1,
    rewardPoints: 120,
    unlockedAt: new Date().toISOString(),
  },
  {
    id: 'veggie-lover',
    title: 'Майстер зелені',
    description: 'Приготуйте 5 веганських страв поспіль.',
    icon: 'leaf',
    progress: 2,
    goal: 5,
    rewardPoints: 250,
  },
  {
    id: 'zero-waste',
    title: 'Zero Waste Hero',
    description: 'Використайте залишки трьох різних страв протягом тижня.',
    icon: 'recycle',
    progress: 1,
    goal: 3,
    rewardPoints: 180,
  },
]

export const weeklyChallenges: CulinaryChallenge[] = [
  {
    id: 'fermented-week',
    title: 'Тиждень ферментації',
    description: 'Додайте ферментований інгредієнт хоча б у 2 страви цього тижня.',
    difficulty: 'intermediate',
    rewardPoints: 320,
    deadline: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
    progress: 1,
    goal: 2,
  },
  {
    id: 'globetrotter',
    title: 'Смак подорожей',
    description: 'Приготуйте три страви різних кухонь світу.',
    difficulty: 'beginner',
    rewardPoints: 260,
    deadline: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(),
    progress: 2,
    goal: 3,
  },
]
