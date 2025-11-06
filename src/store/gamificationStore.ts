import { create } from 'zustand';
import { Achievement, Challenge } from '../types';
import { addDays } from '../utils/time';

type GamificationState = {
  xp: number;
  level: number;
  achievements: Achievement[];
  challenges: Challenge[];
  unlockAchievement: (id: string) => void;
  completeChallenge: (id: string) => void;
};

const initialAchievements: Achievement[] = [
  {
    id: 'ach-voice-chef',
    name: 'Голосовий шеф',
    description: 'Згенерувати рецепт голосовою командою.',
    icon: '🎙️',
    unlockedAt: null,
    progress: 0,
    target: 1
  },
  {
    id: 'ach-zero-waste',
    name: 'Zero Waste',
    description: 'Приготувати 3 страви з залишків.',
    icon: '♻️',
    unlockedAt: null,
    progress: 1,
    target: 3
  }
];

const initialChallenges: Challenge[] = [
  {
    id: 'ch-plant-power',
    title: 'Тиждень рослинної енергії',
    description: 'Приготуйте 5 веганських страв упродовж тижня.',
    rewardXp: 200,
    expiresAt: addDays(new Date(), 6).toISOString(),
    status: 'active'
  },
  {
    id: 'ch-spice-master',
    title: 'Майстер спецій',
    description: 'Спробуйте нову спецію двічі за три дні.',
    rewardXp: 120,
    expiresAt: addDays(new Date(), 3).toISOString(),
    status: 'upcoming'
  }
];

export const useGamificationStore = create<GamificationState>((set) => ({
  xp: 840,
  level: 5,
  achievements: initialAchievements,
  challenges: initialChallenges,
  unlockAchievement: (id) =>
    set((state) => ({
      achievements: state.achievements.map((achievement) =>
        achievement.id === id
          ? {
              ...achievement,
              unlockedAt: achievement.unlockedAt ?? new Date().toISOString(),
              progress: achievement.target
            }
          : achievement
      ),
      xp: state.xp + 100
    })),
  completeChallenge: (id) =>
    set((state) => ({
      challenges: state.challenges.map((challenge) =>
        challenge.id === id
          ? { ...challenge, status: 'completed' }
          : challenge
      ),
      xp: state.xp +
        (state.challenges.find((challenge) => challenge.id === id)?.rewardXp ?? 0),
      level: Math.floor((state.xp +
        (state.challenges.find((challenge) => challenge.id === id)?.rewardXp ?? 0)) / 200)
    }))
}));
