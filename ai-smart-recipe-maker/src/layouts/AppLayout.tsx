import { ChefHat, ClipboardList, Flame, Mic, ShoppingCart, Sparkles, Users, Utensils } from 'lucide-react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { clsx } from 'clsx'
import { useProfileStore } from '../stores/useProfileStore'
import { useGamificationStore } from '../stores/useGamificationStore'

const navItems = [
  { to: '/', label: 'Панель', icon: ChefHat },
  { to: '/recipes', label: 'Рецепти', icon: Utensils },
  { to: '/pantry', label: 'Запаси', icon: ClipboardList },
  { to: '/shopping-list', label: 'Покупки', icon: ShoppingCart },
  { to: '/community', label: 'Спільнота', icon: Users },
  { to: '/challenges', label: 'Виклики', icon: Flame },
  { to: '/assistant', label: 'Асистент', icon: Mic },
  { to: '/profile', label: 'Профіль', icon: Sparkles },
]

const AppLayout = () => {
  const location = useLocation()
  const profile = useProfileStore((state) => state.profile)
  const points = useGamificationStore((state) => state.points)

  const activeSection = (() => {
    if (location.pathname === '/') return 'Панель'
    const match = navItems.find((item) => item.to !== '/' && location.pathname.startsWith(item.to))
    return match?.label ?? 'AI Smart Recipe Maker'
  })()

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <aside className="hidden w-64 flex-col border-r border-slate-800 bg-slate-900/70 p-6 lg:flex">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-indigo-500 shadow-glow">
            <ChefHat className="h-7 w-7" />
          </div>
          <div>
            <p className="text-sm uppercase tracking-wide text-brand-200">AI Smart</p>
            <h1 className="text-xl font-semibold">Recipe Maker</h1>
          </div>
        </div>

        <nav className="flex flex-1 flex-col gap-1">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  clsx(
                    'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition',
                    isActive
                      ? 'bg-brand-500/20 text-brand-100 shadow-inner'
                      : 'text-slate-300 hover:bg-slate-800/60 hover:text-white',
                  )
                }
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </NavLink>
            )
          })}
        </nav>

        <div className="mt-6 rounded-2xl border border-slate-700 bg-slate-900/60 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-400">Сьогодні</p>
          <p className="mt-2 text-lg font-semibold text-white">{profile.name}</p>
          <p className="text-sm text-slate-300">Зароблені бали: <span className="text-brand-200 font-semibold">{points}</span></p>
          <p className="text-xs text-slate-400">Дієта: {profile.dietaryPreferences.join(', ') || 'без обмежень'}</p>
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-10 border-b border-slate-800 bg-slate-950/80 backdrop-blur">
          <div className="flex items-center justify-between px-4 py-4 lg:px-8">
            <div className="flex flex-col">
              <span className="text-xs uppercase tracking-wide text-slate-400">Локація</span>
              <span className="text-lg font-semibold text-white">{activeSection}</span>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden flex-col text-right lg:flex">
                <span className="text-sm text-slate-300">{profile.name}</span>
                <span className="text-xs text-slate-500">{profile.favoriteCuisines[0] ?? 'Food Explorer'}</span>
              </div>
              <img
                src={profile.avatar}
                alt={profile.name}
                className="h-10 w-10 rounded-full border border-brand-400/40 object-cover"
              />
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900">
          <div className="mx-auto w-full max-w-7xl px-4 py-8 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default AppLayout
