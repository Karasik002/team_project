import { DateTime } from "luxon";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { v4 as uuid } from "uuid";

import { Achievement, CulinaryChallenge } from "../types";

interface GamificationState {
  points: number;
  streak: number;
  achievements: Achievement[];
  challenges: CulinaryChallenge[];
  unlockAchievement: (achievementId: string) => void;
  completeChallenge: (challengeId: string) => void;
  addPoints: (points: number) => void;
  resetStreak: () => void;
  incrementStreak: () => void;
}

const defaultAchievements: Achievement[] = [
  {
    id: "start-journey",
    title: "Перший крок",
    description: "Згенеруйте свій перший рецепт",
    icon: "🚀",
    requirement: "AI recipe generated"
  },
  {
    id: "healthy-habit",
    title: "Здорова звичка",
    description: "Приготуйте 5 страв поспіль без пропусків",
    icon: "🥗",
    requirement: "5-day cooking streak"
  },
  {
    id: "community-star",
    title: "Зірка спільноти",
    description: "Поділіться власним рецептом і отримайте 3 відгуки",
    icon: "🌟",
    requirement: "3 reviews on shared recipe"
  }
];

const defaultChallenges: CulinaryChallenge[] = [
  {
    id: uuid(),
    title: "Тиждень зелених смузі",
    description: "Приготуйте 3 різні смузі на рослинній основі",
    deadline: DateTime.now().plus({ weeks: 1 }).toISO(),
    difficulty: "easy",
    rewardPoints: 120
  },
  {
    id: uuid(),
    title: "Zero Waste Weekend",
    description: "Створіть 2 рецепти, використовуючи залишки з комори",
    deadline: DateTime.now().plus({ days: 5 }).toISO(),
    difficulty: "medium",
    rewardPoints: 200
  }
];

export const useGamificationStore = create<GamificationState>()(
  persist(
    (set) => ({
      points: 450,
      streak: 3,
      achievements: defaultAchievements,
      challenges: defaultChallenges,
      unlockAchievement: (achievementId) =>
        set((state) => ({
          achievements: state.achievements.map((achievement) =>
            achievement.id === achievementId && !achievement.unlockedAt
              ? { ...achievement, unlockedAt: DateTime.now().toISO() }
              : achievement
          ),
          points: state.points + 100
        })),
      completeChallenge: (challengeId) =>
        set((state) => ({
          challenges: state.challenges.map((challenge) =>
            challenge.id === challengeId && !challenge.completedAt
              ? { ...challenge, completedAt: DateTime.now().toISO() }
              : challenge
          ),
          points:
            state.points +
            (state.challenges.find((challenge) => challenge.id === challengeId)?.rewardPoints ?? 0)
        })),
      addPoints: (points) => set((state) => ({ points: state.points + points })),
      resetStreak: () => set({ streak: 0 }),
      incrementStreak: () => set((state) => ({ streak: state.streak + 1 }))
    }),
    {
      name: "ai-smart-recipe-maker-gamification",
      storage: createJSONStorage(() => localStorage)
    }
  )
);
