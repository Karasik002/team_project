import { Trophy, Zap } from 'lucide-react'
import Card from '../components/core/Card'
import Badge from '../components/core/Badge'
import Button from '../components/core/Button'
import { useGamificationStore } from '../stores/useGamificationStore'

const ChallengesPage = () => {
  const { challenges, achievements, points, streakDays, updateChallengeProgress } = useGamificationStore((state) => state)

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-3 rounded-3xl border border-slate-800/70 bg-slate-900/70 p-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Гейміфікація та виклики</h1>
          <p className="text-sm text-slate-300">Накопичуйте бали, проходьте виклики та відкривайте нові досягнення.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="info">Бали: {points}</Badge>
          <Badge variant="success">Серія: {streakDays} дні</Badge>
        </div>
      </header>

      <section className="grid gap-6 md:grid-cols-2">
        {challenges.map((challenge) => {
          const progressPercent = Math.min(100, Math.round((challenge.progress / challenge.goal) * 100))
          return (
            <Card key={challenge.id} className="border-slate-800/70 bg-slate-900/70">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-white">{challenge.title}</h2>
                  <p className="text-sm text-slate-300">{challenge.description}</p>
                </div>
                <Badge variant="warning">{challenge.difficulty}</Badge>
              </div>
              <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-brand-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                <span>Прогрес: {challenge.progress}/{challenge.goal}</span>
                <span>Нагорода: {challenge.rewardPoints} балів</span>
              </div>
              <Button
                variant="secondary"
                size="sm"
                className="mt-4"
                icon={<Zap className="h-4 w-4" />}
                onClick={() => updateChallengeProgress(challenge.id, 1)}
              >
                Додати прогрес
              </Button>
            </Card>
          )
        })}
      </section>

      <section className="grid gap-4">
        <h2 className="text-sm font-semibold text-white">Активні досягнення</h2>
        {achievements.map((achievement) => {
          const percent = Math.min(100, Math.round((achievement.progress / achievement.goal) * 100))
          return (
            <Card key={achievement.id} className="flex flex-col gap-2 border-slate-800/70 bg-slate-900/70">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-semibold text-white">{achievement.title}</h3>
                  <p className="text-sm text-slate-300">{achievement.description}</p>
                </div>
                <Badge variant="info" className="flex items-center gap-1">
                  <Trophy className="h-4 w-4" /> {achievement.rewardPoints}
                </Badge>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
                <div className="h-full rounded-full bg-brand-500" style={{ width: `${percent}%` }} />
              </div>
              <p className="text-xs text-slate-400">{achievement.progress}/{achievement.goal}</p>
            </Card>
          )
        })}
      </section>
    </div>
  )
}

export default ChallengesPage
