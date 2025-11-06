import { Suspense } from 'react';
import { NavLink, Route, Routes } from 'react-router-dom';
import { FiChefHat, FiHome, FiList, FiMic, FiShare2, FiTarget, FiUser } from 'react-icons/fi';
import HomePage from './pages/HomePage';
import PantryPage from './pages/PantryPage';
import ProfilePage from './pages/ProfilePage';
import ChallengesPage from './pages/ChallengesPage';
import CommunityPage from './pages/CommunityPage';
import AssistantPage from './pages/AssistantPage';
import { useUserStore } from './store/userStore';

const navItems = [
  { to: '/', label: 'Головна', icon: FiHome },
  { to: '/pantry', label: 'Комора', icon: FiList },
  { to: '/profile', label: 'Профіль', icon: FiUser },
  { to: '/challenges', label: 'Челенджі', icon: FiTarget },
  { to: '/community', label: 'Спільнота', icon: FiShare2 },
  { to: '/assistant', label: 'Асистент', icon: FiMic }
];

const App = () => {
  const profile = useUserStore((state) => state.profile);
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-[#13111c] text-slate-100">
      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col gap-8 px-6 py-10">
        <header className="glass-panel sticky top-6 z-10 flex flex-col gap-6 rounded-3xl p-6 shadow-soft">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-3 text-primary">
              <FiChefHat className="text-3xl" />
              <div>
                <p className="text-xs uppercase tracking-widest text-slate-400">AI Smart Recipe Maker</p>
                <h1 className="text-xl font-semibold text-slate-50">Персональний шеф на вашій кухні</h1>
              </div>
            </div>
            <div className="ml-auto flex flex-wrap items-center gap-5 text-sm text-slate-300">
              <div>
                <p className="text-xs text-slate-500">Сьогодні готує</p>
                <span className="font-medium text-slate-50">{profile.name}</span>
              </div>
              <div className="hidden md:flex flex-col">
                <p className="text-xs text-slate-500">Дієта</p>
                <span>{profile.diets.join(', ') || 'Гнучка'}</span>
              </div>
              <div className="hidden md:flex flex-col">
                <p className="text-xs text-slate-500">Калорії / день</p>
                <span>{profile.goals.calories}</span>
              </div>
            </div>
          </div>
          <nav className="flex flex-wrap gap-2">
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `group flex items-center gap-2 rounded-full px-4 py-2 text-sm transition-all duration-200 ${
                    isActive
                      ? 'bg-primary text-slate-950 shadow-lg shadow-primary/40'
                      : 'bg-slate-800/40 text-slate-300 hover:bg-slate-700/50 hover:text-slate-100'
                  }`
                }
                end={to === '/'}
              >
                <Icon className="text-lg" />
                {label}
              </NavLink>
            ))
          </nav>
        </header>
        <main className="flex-1 pb-16">
          <Suspense fallback={<div className="text-slate-400">Завантаження...</div>}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/pantry" element={<PantryPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/challenges" element={<ChallengesPage />} />
              <Route path="/community" element={<CommunityPage />} />
              <Route path="/assistant" element={<AssistantPage />} />
            </Routes>
          </Suspense>
        </main>
      </div>
    </div>
  );
};

export default App;
