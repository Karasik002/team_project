import type { FormEvent } from 'react'
import { useState } from 'react'
import { PenSquare, Shield, UserCog } from 'lucide-react'
import Card from '../components/core/Card'
import Button from '../components/core/Button'
import Badge from '../components/core/Badge'
import { useProfileStore } from '../stores/useProfileStore'

const availableAllergies = ['nuts', 'dairy', 'eggs', 'shellfish', 'soy', 'wheat', 'gluten']
const availableDiets = ['omnivore', 'vegetarian', 'vegan', 'pescatarian', 'keto', 'gluten-free']

const ProfilePage = () => {
  const { profile, updateProfile, updateMacroTarget } = useProfileStore((state) => state)
  const [name, setName] = useState(profile.name)
  const [favoriteCuisines, setFavoriteCuisines] = useState(profile.favoriteCuisines.join(', '))
  const [caloricTarget, setCaloricTarget] = useState(profile.caloricTarget)
  const [macroTarget, setMacroTarget] = useState(profile.macroTarget)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    updateProfile({
      name: name.trim() || profile.name,
      favoriteCuisines: favoriteCuisines
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
      caloricTarget,
    })
    updateMacroTarget(macroTarget)
  }

  const toggleDiet = (diet: string) => {
    const current = profile.dietaryPreferences.includes(diet as any)
    updateProfile({
      dietaryPreferences: current
        ? profile.dietaryPreferences.filter((item) => item !== diet)
        : [...profile.dietaryPreferences, diet as any],
    })
  }

  const toggleAllergy = (allergy: string) => {
    const current = profile.allergies.includes(allergy as any)
    updateProfile({
      allergies: current
        ? profile.allergies.filter((item) => item !== allergy)
        : [...profile.allergies, allergy as any],
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-3 rounded-3xl border border-slate-800/70 bg-slate-900/70 p-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <img src={profile.avatar} alt={profile.name} className="h-14 w-14 rounded-2xl object-cover" />
          <div>
            <h1 className="text-2xl font-semibold text-white">{profile.name}</h1>
            <p className="text-sm text-slate-300">Персоналізація рекомендацій AI Smart Recipe Maker</p>
          </div>
        </div>
        <Badge variant="info">Оновлено {new Date(profile.updatedAt).toLocaleString()}</Badge>
      </header>

      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-2">
        <Card className="border-slate-800/70 bg-slate-900/70">
          <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-white">
            <UserCog className="h-4 w-4" /> Основна інформація
          </h2>
          <div className="flex flex-col gap-3 text-sm text-slate-300">
            <label className="flex flex-col gap-1">
              Ім’я
              <input
                className="rounded-xl border border-slate-800/70 bg-slate-900/60 px-3 py-2 text-slate-100 focus:border-brand-500 focus:outline-none"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </label>
            <label className="flex flex-col gap-1">
              Улюблені кухні
              <input
                className="rounded-xl border border-slate-800/70 bg-slate-900/60 px-3 py-2 text-slate-100 focus:border-brand-500 focus:outline-none"
                value={favoriteCuisines}
                onChange={(event) => setFavoriteCuisines(event.target.value)}
                placeholder="Середземноморська, Паназійська"
              />
              <span className="text-xs text-slate-500">Вкажіть через кому — це впливатиме на стилі страв.</span>
            </label>
            <label className="flex flex-col gap-1">
              Цільові калорії на день
              <input
                type="number"
                min={1200}
                className="rounded-xl border border-slate-800/70 bg-slate-900/60 px-3 py-2 text-slate-100 focus:border-brand-500 focus:outline-none"
                value={caloricTarget}
                onChange={(event) => setCaloricTarget(Number(event.target.value))}
              />
            </label>
          </div>
        </Card>

        <Card className="border-slate-800/70 bg-slate-900/70">
          <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-white">
            <Shield className="h-4 w-4" /> Алергії та дієти
          </h2>
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-2">
              {availableAllergies.map((allergy) => {
                const active = profile.allergies.includes(allergy as any)
                return (
                  <button
                    key={allergy}
                    type="button"
                    className={`rounded-full px-3 py-1 text-xs font-medium transition ${active ? 'bg-rose-500/20 text-rose-200' : 'bg-slate-800/70 text-slate-300 hover:bg-slate-700/70'}`}
                    onClick={() => toggleAllergy(allergy)}
                  >
                    {allergy}
                  </button>
                )
              })}
            </div>
            <div className="flex flex-wrap gap-2">
              {availableDiets.map((diet) => {
                const active = profile.dietaryPreferences.includes(diet as any)
                return (
                  <button
                    key={diet}
                    type="button"
                    className={`rounded-full px-3 py-1 text-xs font-medium transition ${active ? 'bg-brand-500/20 text-brand-200' : 'bg-slate-800/70 text-slate-300 hover:bg-slate-700/70'}`}
                    onClick={() => toggleDiet(diet)}
                  >
                    {diet}
                  </button>
                )
              })}
            </div>
          </div>
        </Card>

        <Card className="border-slate-800/70 bg-slate-900/70">
          <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-white">
            <PenSquare className="h-4 w-4" /> Цілі по БЖВ
          </h2>
          <div className="grid gap-3 md:grid-cols-2">
            <label className="flex flex-col gap-1 text-sm text-slate-300">
              Білки (г)
              <input
                type="number"
                className="rounded-xl border border-slate-800/70 bg-slate-900/60 px-3 py-2 text-slate-100 focus:border-brand-500 focus:outline-none"
                value={macroTarget.protein}
                onChange={(event) => setMacroTarget((prev) => ({ ...prev, protein: Number(event.target.value) }))}
              />
            </label>
            <label className="flex flex-col gap-1 text-sm text-slate-300">
              Вуглеводи (г)
              <input
                type="number"
                className="rounded-xl border border-slate-800/70 bg-slate-900/60 px-3 py-2 text-slate-100 focus:border-brand-500 focus:outline-none"
                value={macroTarget.carbs}
                onChange={(event) => setMacroTarget((prev) => ({ ...prev, carbs: Number(event.target.value) }))}
              />
            </label>
            <label className="flex flex-col gap-1 text-sm text-slate-300">
              Жири (г)
              <input
                type="number"
                className="rounded-xl border border-slate-800/70 bg-slate-900/60 px-3 py-2 text-slate-100 focus:border-brand-500 focus:outline-none"
                value={macroTarget.fats}
                onChange={(event) => setMacroTarget((prev) => ({ ...prev, fats: Number(event.target.value) }))}
              />
            </label>
            <label className="flex flex-col gap-1 text-sm text-slate-300">
              Калорії (перерахунок)
              <input
                type="number"
                className="rounded-xl border border-slate-800/70 bg-slate-900/60 px-3 py-2 text-slate-100 focus:border-brand-500 focus:outline-none"
                value={macroTarget.calories}
                onChange={(event) => setMacroTarget((prev) => ({ ...prev, calories: Number(event.target.value) }))}
              />
            </label>
          </div>
        </Card>

        <div className="lg:col-span-2">
          <Button type="submit">Зберегти зміни</Button>
        </div>
      </form>
    </div>
  )
}

export default ProfilePage
