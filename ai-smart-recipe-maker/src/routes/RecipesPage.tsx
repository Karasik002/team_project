import { useMemo, useState } from 'react'
import { ArrowLeft, ChefHat, Filter, Flame, RefreshCcw } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Card from '../components/core/Card'
import Badge from '../components/core/Badge'
import Button from '../components/core/Button'
import RecipeCard from '../components/recipes/RecipeCard'
import { useRecipeStore } from '../stores/useRecipeStore'
import { useProfileStore } from '../stores/useProfileStore'
import { useShoppingListStore } from '../stores/useShoppingListStore'
import { useGamificationStore } from '../stores/useGamificationStore'

const RecipesPage = () => {
  const navigate = useNavigate()
  const { generatedRecipes, lastIngredients, history } = useRecipeStore((state) => state)
  const profile = useProfileStore((state) => state.profile)
  const toggleFavorite = useProfileStore((state) => state.toggleFavoriteRecipe)
  const addCookedRecipe = useProfileStore((state) => state.addCookedRecipe)
  const logCookingSession = useGamificationStore((state) => state.logCookingSession)
  const addToShoppingList = useShoppingListStore((state) => state.syncMissingIngredients)

  const [dietFilter, setDietFilter] = useState<string>('all')

  const filteredRecipes = useMemo(() => {
    if (dietFilter === 'all') return generatedRecipes
    return generatedRecipes.filter((recipe) => recipe.suitableFor.includes(dietFilter as any))
  }, [generatedRecipes, dietFilter])

  const handleMarkCooked = (recipeId: string) => {
    addCookedRecipe(recipeId)
    logCookingSession({ recipeId, wasNew: !profile.cookedRecipes.includes(recipeId) })
  }

  if (generatedRecipes.length === 0) {
    return (
      <Card className="flex flex-col items-center gap-4 border-dashed border-brand-500/40 bg-slate-900/60 py-16 text-center">
        <ChefHat className="h-12 w-12 text-brand-400" />
        <h2 className="text-xl font-semibold text-white">Поки що немає рецептів</h2>
        <p className="max-w-lg text-sm text-slate-300">
          Додайте інгредієнти на панелі, щоб AI створив колекцію персоналізованих страв із відео-гідами та порахованою калорійністю.
        </p>
        <Button icon={<ArrowLeft className="h-4 w-4" />} onClick={() => navigate('/')}>Повернутись на панель</Button>
      </Card>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-4 rounded-3xl border border-slate-800/70 bg-slate-900/70 p-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">AI Smart Recipe Library</h1>
          <p className="text-sm text-slate-300">
            {generatedRecipes.length} рецептів, згенерованих на основі: {lastIngredients.join(', ') || 'ваших вподобань'}
          </p>
          {history.length > 0 && (
            <p className="text-xs text-slate-500">Останнє оновлення: {new Date(history[0].generatedAt).toLocaleString()}</p>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 rounded-xl border border-slate-800/60 bg-slate-900/60 px-3 py-2 text-xs">
            <Filter className="h-4 w-4 text-brand-300" />
            <select
              value={dietFilter}
              onChange={(event) => setDietFilter(event.target.value)}
              className="bg-transparent text-slate-200 focus:outline-none"
            >
              <option value="all">Усі дієти</option>
              {profile.dietaryPreferences.map((diet) => (
                <option key={diet} value={diet}>
                  {diet}
                </option>
              ))}
            </select>
          </label>
          <Button variant="ghost" size="sm" icon={<RefreshCcw className="h-4 w-4" />} onClick={() => navigate('/')}>Нове генерування</Button>
        </div>
      </header>

      <div className="grid gap-6">
        {filteredRecipes.map((recipe) => (
          <div key={recipe.id} className="flex flex-col gap-4 rounded-3xl border border-slate-800/60 bg-slate-900/70 p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <Badge variant="info">Рейтинг {recipe.rating.toFixed(1)}</Badge>
                <Badge variant="success">{recipe.reviews} відгуків</Badge>
                <Badge variant="warning">Новизна {Math.round(recipe.noveltyScore * 100)}%</Badge>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  icon={<Flame className="h-4 w-4" />}
                  onClick={() => handleMarkCooked(recipe.id)}
                >
                  Приготовано!
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => addToShoppingList(recipe)}
                >
                  В список покупок
                </Button>
              </div>
            </div>
            <RecipeCard
              recipe={recipe}
              onView={(selected) => navigate(`/recipes/${selected.id}`)}
              onAddToShoppingList={addToShoppingList}
              isFavorite={profile.favoriteRecipeIds.includes(recipe.id)}
              onToggleFavorite={toggleFavorite}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default RecipesPage
