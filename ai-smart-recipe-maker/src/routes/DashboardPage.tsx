import { useMemo } from 'react'
import { ArrowUpRight, Bell, ChefHat, Clock4, History, Leaf, Sparkles, Trophy } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import IngredientInput from '../components/recipes/IngredientInput'
import { useProfileStore } from '../stores/useProfileStore'
import { useRecipeStore } from '../stores/useRecipeStore'
import { usePantryStore } from '../stores/usePantryStore'
import { useShoppingListStore } from '../stores/useShoppingListStore'
import { useGamificationStore } from '../stores/useGamificationStore'
import RecipeCard from '../components/recipes/RecipeCard'
import Card from '../components/core/Card'
import Badge from '../components/core/Badge'
import Button from '../components/core/Button'

const DashboardPage = () => {
  const navigate = useNavigate()
  const profile = useProfileStore((state) => state.profile)
  const toggleFavorite = useProfileStore((state) => state.toggleFavoriteRecipe)
  const { generatedRecipes, generate, loading, history } = useRecipeStore((state) => state)
  const pantryItems = usePantryStore((state) => state.items)
  const getExpiringSoon = usePantryStore((state) => state.getExpiringSoon)
  const addToShoppingList = useShoppingListStore((state) => state.syncMissingIngredients)
  const { achievements, challenges, points, streakDays } = useGamificationStore((state) => state)

  const expiringSoon = useMemo(() => getExpiringSoon(5), [getExpiringSoon])

  const handleGenerate = ({ ingredients, useLeftovers, prioritizeBudget, servings }: {
    ingredients: string[]
    useLeftovers: boolean
    prioritizeBudget: boolean
    servings: number
  }) => {
    generate({
      ingredients,
      profile,
      pantryItems,
      options: {
        useLeftovers,
        prioritizeBudget,
        servings,
      },
    })
  }

  return (
    <div className="flex flex-col gap-8">
      <section className="grid gap-6 md:grid-cols-[1.4fr,1fr]">
        <IngredientInput
          onGenerate={handleGenerate}
          loading={loading}
          defaultIngredients={history[0]?.ingredients ?? []}
        />

        <div className="flex flex-col gap-4">
          <Card className="border-brand-500/20 bg-slate-900/80">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500/20 text-brand-200">
                <ChefHat className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <p className="text-xs uppercase tracking-wide text-slate-400">Ваш персоналізований день</p>
                <p className="text-lg font-semibold text-white">{profile.name}</p>
                <p className="text-sm text-slate-300">{profile.favoriteCuisines.join(', ') || 'Гастрономічний дослідник'}</p>
              </div>
            </div>
            <div className="mt-5 grid gap-3 text-sm text-slate-300">
              <div className="flex items-center justify-between rounded-2xl border border-slate-800/70 bg-slate-900/60 px-4 py-3">
                <div className="flex items-center gap-2 text-slate-200">
                  <Leaf className="h-4 w-4 text-brand-300" /> Дієта
                </div>
                <span>{profile.dietaryPreferences.join(', ') || 'без обмежень'}</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl border border-slate-800/70 bg-slate-900/60 px-4 py-3">
                <div className="flex items-center gap-2 text-slate-200">
                  <Trophy className="h-4 w-4 text-amber-300" /> Балів AI Smart
                </div>
                <span className="font-semibold text-brand-100">{points}</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl border border-slate-800/70 bg-slate-900/60 px-4 py-3">
                <div className="flex items-center gap-2 text-slate-200">
                  <Clock4 className="h-4 w-4 text-emerald-300" /> Кулінарна серія
                </div>
                <span>{streakDays} дні поспіль</span>
              </div>
            </div>
          </Card>

          <Card className="flex flex-col gap-3 border-slate-800/70 bg-slate-900/70">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">Досягнення</h3>
              <Badge variant="success">{achievements.length} активні</Badge>
            </div>
            <div className="flex flex-col gap-3 text-sm text-slate-300">
              {achievements.slice(0, 2).map((achievement) => (
                <div key={achievement.id} className="rounded-2xl border border-slate-800/60 bg-slate-900/60 p-3">
                  <p className="font-medium text-slate-100">{achievement.title}</p>
                  <p className="text-xs text-slate-400">{achievement.description}</p>
                  <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-800">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-brand-500 to-indigo-500"
                      style={{ width: `${Math.min(100, (achievement.progress / achievement.goal) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">Свіжі AI-рецепти</h2>
            <p className="text-sm text-slate-300">З урахуванням ваших вподобань, алергій та запасів.</p>
          </div>
          {generatedRecipes.length === 0 && (
            <Badge variant="default" className="bg-slate-800/80 text-slate-200">
              Згенеруйте рецепти, щоб побачити магію
            </Badge>
          )}
        </div>

        <div className="flex flex-col gap-6">
          {generatedRecipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onView={(selected) => navigate(`/recipes/${selected.id}`)}
              onAddToShoppingList={(selected) => addToShoppingList(selected)}
              isFavorite={profile.favoriteRecipeIds.includes(recipe.id)}
              onToggleFavorite={toggleFavorite}
            />
          ))}

          {generatedRecipes.length === 0 && (
            <Card className="flex flex-col items-center gap-3 border-dashed border-slate-700 bg-slate-900/50 py-16 text-center">
              <Sparkles className="h-10 w-10 text-brand-400" />
              <h3 className="text-lg font-semibold text-white">Почніть гастрономічну пригоду</h3>
              <p className="max-w-xl text-sm text-slate-300">
                Вкажіть, що маєте на кухні, і AI запропонує страви з фото, відео, покроковими інструкціями та підрахунком калорій.
              </p>
            </Card>
          )}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <Card className="border-slate-800/60 bg-slate-900/70">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">Історія генерацій</h3>
            <Badge variant="info" className="flex items-center gap-1">
              <History className="h-3.5 w-3.5" /> {history.length}
            </Badge>
          </div>
          <div className="flex flex-col gap-3 text-sm text-slate-300">
            {history.slice(0, 4).map((item) => (
              <div key={item.id} className="rounded-2xl border border-slate-800/60 bg-slate-900/60 p-4">
                <p className="text-slate-200">{item.ingredients.join(', ')}</p>
                <p className="text-xs text-slate-500">{new Date(item.generatedAt).toLocaleString()}</p>
              </div>
            ))}
            {history.length === 0 && <p className="text-xs text-slate-500">Ще немає історії – згенеруйте перший рецепт.</p>}
          </div>
        </Card>

        <Card className="border-amber-500/20 bg-slate-900/75">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">Контроль термінів</h3>
            <Badge variant="warning" className="flex items-center gap-1">
              <Bell className="h-3.5 w-3.5" /> {expiringSoon.length}
            </Badge>
          </div>
          <div className="flex flex-col gap-3 text-sm text-slate-300">
            {expiringSoon.length > 0 ? (
              expiringSoon.map((item) => (
                <div key={item.id} className="flex items-center justify-between rounded-2xl border border-slate-800/60 bg-slate-900/60 p-3">
                  <div>
                    <p className="font-medium text-slate-100">{item.name}</p>
                    <p className="text-xs text-slate-400">{item.quantity} {item.unit}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-400">Придатне до</p>
                    <p className="text-sm text-amber-200">{item.expiryDate ? new Date(item.expiryDate).toLocaleDateString() : 'сьогодні'}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500">Жодних критичних продуктів. Час експериментувати!</p>
            )}
            <Button variant="ghost" className="self-start" icon={<ArrowUpRight className="h-4 w-4" />} onClick={() => navigate('/pantry')}>
              Перейти до запасів
            </Button>
          </div>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <Card className="border-slate-800/60 bg-slate-900/70">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">Поточні кулінарні виклики</h3>
            <Badge variant="info">{challenges.length}</Badge>
          </div>
          <div className="flex flex-col gap-4">
            {challenges.slice(0, 2).map((challenge) => (
              <div key={challenge.id} className="rounded-2xl border border-slate-800/60 bg-slate-900/60 p-4">
                <p className="text-sm font-semibold text-slate-100">{challenge.title}</p>
                <p className="text-xs text-slate-400">{challenge.description}</p>
                <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-800">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-brand-500"
                    style={{ width: `${Math.min(100, (challenge.progress / challenge.goal) * 100)}%` }}
                  />
                </div>
                <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
                  <span>Бали: {challenge.rewardPoints}</span>
                  <span>До {new Date(challenge.deadline).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </div>
  )
}

export default DashboardPage
