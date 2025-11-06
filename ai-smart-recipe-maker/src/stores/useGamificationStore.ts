import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { defaultAchievements, weeklyChallenges } from '../data/gamification'
import type { Achievement, CulinaryChallenge } from '../types'

interface GamificationState {
  points: number
  streakDays: number
  achievements: Achievement[]
  challenges: CulinaryChallenge[]
  logCookingSession: (options: { recipeId: string; wasNew: boolean; usedLeftovers?: boolean }) => void
  claimAchievement: (achievementId: string) => void
  updateChallengeProgress: (challengeId: string, progressDelta?: number) => void
}

export const useGamificationStore = create<GamificationState>()(
  persist(
    (set) => ({
      points: 640,
      streakDays: 3,
      achievements: defaultAchievements,
      challenges: weeklyChallenges,
      logCookingSession: ({ wasNew, usedLeftovers }) => {
        set((state) => ({
          points: state.points + 40 + (wasNew ? 25 : 0) + (usedLeftovers ? 15 : 0),
          streakDays: state.streakDays + 1,
          achievements: state.achievements.map((achievement) => {
            if (achievement.id === 'first-recipe' && !achievement.unlockedAt) {
              return { ...achievement, progress: achievement.goal, unlockedAt: new Date().toISOString() }
            }

            if (achievement.id === 'zero-waste' && usedLeftovers) {
              const progress = Math.min(achievement.goal, achievement.progress + 1)
              return {
                ...achievement,
                progress,
                unlockedAt: progress === achievement.goal ? new Date().toISOString() : achievement.unlockedAt,
              }
            }

            return achievement
          }),
        }))
      },
      claimAchievement: (achievementId) =>
        set((state) => {
          const achievement = state.achievements.find((item) => item.id === achievementId)
          if (!achievement) return state
          if (!achievement.unlockedAt) {
            return state
          }

          return {
            ...state,
            points: state.points + achievement.rewardPoints,
            achievements: state.achievements.filter((item) => item.id !== achievementId),
          }
        }),
      updateChallengeProgress: (challengeId, progressDelta = 1) =>
        set((state) => ({
          challenges: state.challenges.map((challenge) =>
            challenge.id === challengeId
              ? {
                  ...challenge,
                  progress: Math.min(challenge.goal, challenge.progress + progressDelta),
                }
              : challenge,
          ),
        })),
    }),
    {
      name: 'ai-smart-gamification',
    },
  ),
)
