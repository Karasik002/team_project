import { FiAward, FiCheckSquare, FiFlag, FiTarget } from 'react-icons/fi';
import { useGamificationStore } from '../store/gamificationStore';
import { formatRelative } from '../utils/time';

const ChallengesPage = () => {
  const { xp, level, achievements, challenges, unlockAchievement, completeChallenge } = useGamificationStore();

  return (
    <div className="grid gap-6 lg:grid-cols-[1.4fr,1fr]">
      <section className="glass-panel rounded-3xl p-6 shadow-soft">
        <header className="mb-6 flex flex-wrap items-center gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-slate-50">Гейміфікація & виклики</h2>
            <p className="text-sm text-slate-400">Заробляйте XP, відкривайте нові навички та змагайтеся зі спільнотою.</p>
          </div>
          <div className="ml-auto flex gap-4 text-sm text-slate-300">
            <div className="rounded-2xl bg-slate-900/50 px-4 py-2">
              <p className="text-xs text-slate-500">Рівень</p>
              <span className="text-lg font-semibold text-primary">{level}</span>
            </div>
            <div className="rounded-2xl bg-slate-900/50 px-4 py-2">
              <p className="text-xs text-slate-500">Досвід</p>
              <span className="text-lg font-semibold text-slate-100">{xp} XP</span>
            </div>
          </div>
        </header>

        <div className="space-y-4">
          {challenges.map((challenge) => (
            <div key={challenge.id} className="rounded-3xl border border-slate-800/60 bg-slate-900/40 p-5">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-3 text-slate-200">
                  <FiTarget className="text-xl text-primary" />
                  <div>
                    <h3 className="text-lg font-semibold">{challenge.title}</h3>
                    <p className="text-sm text-slate-400">{challenge.description}</p>
                  </div>
                </div>
                <div className="ml-auto flex items-center gap-3 text-xs text-slate-400">
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-primary">{challenge.rewardXp} XP</span>
                  <span className="rounded-full bg-slate-800/50 px-3 py-1">{formatRelative(challenge.expiresAt)}</span>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-3 text-xs">
                <span className={`rounded-full px-3 py-1 ${
                  challenge.status === 'completed'
                    ? 'bg-emerald-500/10 text-emerald-200'
                    : challenge.status === 'active'
                    ? 'bg-primary/10 text-primary'
                    : 'bg-slate-800/50 text-slate-400'
                }`}>{challenge.status}</span>
                {challenge.status === 'active' && (
                  <button
                    type="button"
                    onClick={() => completeChallenge(challenge.id)}
                    className="ml-auto flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-xs font-semibold text-slate-50 transition hover:bg-secondary/90"
                  >
                    <FiCheckSquare /> Завершити
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <aside className="glass-panel flex flex-col gap-5 rounded-3xl p-6 shadow-soft">
        <div>
          <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-200">
            <FiAward /> Досягнення
          </h3>
          <ul className="mt-4 space-y-3 text-sm">
            {achievements.map((achievement) => (
              <li key={achievement.id} className={`rounded-3xl border border-slate-800/60 bg-slate-900/40 p-4 ${achievement.unlockedAt ? 'shadow-inner shadow-emerald-500/10' : ''}`}>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{achievement.icon}</span>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-100">{achievement.name}</p>
                    <p className="text-xs text-slate-500">{achievement.description}</p>
                  </div>
                  {!achievement.unlockedAt && (
                    <button
                      type="button"
                      onClick={() => unlockAchievement(achievement.id)}
                      className="rounded-full bg-primary/10 px-3 py-1 text-xs text-primary hover:bg-primary/20"
                    >
                      Активувати
                    </button>
                  )}
                </div>
                <div className="mt-3 h-2 w-full rounded-full bg-slate-800/60">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${Math.min(100, (achievement.progress / achievement.target) * 100)}%` }}
                  />
                </div>
                <p className="mt-2 text-[11px] text-slate-500">
                  {achievement.unlockedAt ? `Відкрито ${new Date(achievement.unlockedAt).toLocaleString('uk-UA')}` : `Прогрес: ${achievement.progress}/${achievement.target}`}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-3xl border border-slate-800/60 bg-slate-900/40 p-4 text-sm text-slate-300">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-200">
            <FiFlag /> Кулінарні виклики тижня
          </h3>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-xs text-slate-400">
            <li>Заплануйте спільне приготування з другом and поділіться фото.</li>
            <li>Створіть рецепт із трьома зеленими інгредієнтами.</li>
            <li>Знизьте харчові відходи на 20% за допомогою режиму «Zero Waste».</li>
          </ul>
        </div>
      </aside>
    </div>
  );
};

export default ChallengesPage;
