import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, BookmarkCheck, CookingPot, Headphones, Sparkles, Timer } from 'lucide-react'
import Card from '../components/core/Card'
import Badge from '../components/core/Badge'
import Button from '../components/core/Button'
import { useRecipeStore } from '../stores/useRecipeStore'
import { useShoppingListStore } from '../stores/useShoppingListStore'
import { useProfileStore } from '../stores/useProfileStore'
import { useGamificationStore } from '../stores/useGamificationStore'

const RecipeDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { generatedRecipes } = useRecipeStore((state) => state)
  const addToShoppingList = useShoppingListStore((state) => state.syncMissingIngredients)
  const toggleFavorite = useProfileStore((state) => state.toggleFavoriteRecipe)
  const addCookedRecipe = useProfileStore((state) => state.addCookedRecipe)
  const profile = useProfileStore((state) => state.profile)
  const logCookingSession = useGamificationStore((state) => state.logCookingSession)

  const recipe = useMemo(() => generatedRecipes.find((item) => item.id === id), [generatedRecipes, id])

  if (!recipe) {
    return (
      <Card className="flex flex-col items-center gap-4 border-dashed border-slate-700 bg-slate-900/60 py-16 text-center">
        <CookingPot className="h-12 w-12 text-amber-300" />
        <h2 className="text-xl font-semibold text-white">Рецепт не знайдено</h2>
        <p className="max-w-md text-sm text-slate-300">
          Схоже, що ця сторінка відкрилася напряму. Згенеруйте нові рецепти або поверніться до каталогу.
        </p>
        <div className="flex gap-3">
          <Button icon={<ArrowLeft className="h-4 w-4" />} onClick={() => navigate('/recipes')}>
            До рецептів
          </Button>
          <Button variant="secondary" onClick={() => navigate('/')}>На головну</Button>
        </div>
      </Card>
    )
  }

  const markAsCooked = () => {
    addCookedRecipe(recipe.id)
    logCookingSession({ recipeId: recipe.id, wasNew: !profile.cookedRecipes.includes(recipe.id) })
  }

  const handleAssistant = () => {
    navigate('/assistant', { state: { recipeId: recipe.id } })
  }

  return (
    <div className="flex flex-col gap-6">
      <Button variant="ghost" size="sm" icon={<ArrowLeft className="h-4 w-4" />} onClick={() => navigate(-1)}>
        Назад
      </Button>

      <div className="grid gap-6 lg:grid-cols-[1.4fr,1fr]">
        <Card className="overflow-hidden border-slate-800/70 bg-slate-900/70">
          <div className="relative h-72 w-full overflow-hidden rounded-3xl">
            <img src={recipe.image} alt={recipe.title} className="h-full w-full object-cover" />
            <Badge variant="info" className="absolute left-4 top-4">AI Generated</Badge>
          </div>
          <div className="mt-6 flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="success">{recipe.totalTime} хв</Badge>
              <Badge variant="warning">Активно {recipe.activeTime} хв</Badge>
              <Badge variant="info">Порцій: {recipe.servings}</Badge>
            </div>
            <h1 className="text-3xl font-semibold text-white">{recipe.title}</h1>
            <p className="text-sm text-slate-300">{recipe.description}</p>
            <p className="text-xs text-brand-200">{recipe.aiNotes}</p>
            <div className="grid gap-3 rounded-3xl border border-slate-800/60 bg-slate-900/60 p-4 text-sm text-slate-200 md:grid-cols-4">
              <div>
                <p className="text-xs text-slate-400">Калорії</p>
                <p className="text-lg font-semibold text-white">{recipe.nutrition.calories}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Білки</p>
                <p className="text-lg font-semibold text-white">{recipe.nutrition.protein} г</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Вуглеводи</p>
                <p className="text-lg font-semibold text-white">{recipe.nutrition.carbs} г</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Жири</p>
                <p className="text-lg font-semibold text-white">{recipe.nutrition.fats} г</p>
              </div>
            </div>
          </div>
        </Card>

        <div className="flex flex-col gap-4">
          <Card className="border-slate-800/60 bg-slate-900/70">
            <h2 className="mb-3 text-sm font-semibold text-white">Дії</h2>
            <div className="flex flex-col gap-2">
              <Button variant="primary" icon={<Headphones className="h-4 w-4" />} onClick={handleAssistant}>
                Голосовий кухонний режим
              </Button>
              <Button variant="secondary" icon={<BookmarkCheck className="h-4 w-4" />} onClick={() => addToShoppingList(recipe)}>
                Додати відсутні інгредієнти
              </Button>
              <Button variant="secondary" icon={<Sparkles className="h-4 w-4" />} onClick={() => toggleFavorite(recipe.id)}>
                {profile.favoriteRecipeIds.includes(recipe.id) ? 'Видалити з улюблених' : 'Додати в улюблені'}
              </Button>
              <Button variant="ghost" icon={<CookingPot className="h-4 w-4" />} onClick={markAsCooked}>
                Позначити як приготований
              </Button>
            </div>
          </Card>

          <Card className="border-slate-800/60 bg-slate-900/70">
            <h2 className="mb-3 text-sm font-semibold text-white">Поради щодо подачі</h2>
            <ul className="flex list-disc flex-col gap-2 pl-5 text-sm text-slate-300">
              {recipe.suggestions.map((suggestion) => (
                <li key={suggestion.pairing}>
                  <span className="font-medium text-slate-100">{suggestion.pairing}:</span> {suggestion.description}
                </li>
              ))}
            </ul>
            {recipe.leftoverIdeas.length > 0 && (
              <div className="mt-4 rounded-2xl border border-brand-500/30 bg-brand-500/10 p-3 text-sm text-brand-100">
                <p className="text-xs uppercase tracking-wide text-brand-200">Zero Waste</p>
                <ul className="list-disc space-y-1 pl-4">
                  {recipe.leftoverIdeas.map((idea) => (
                    <li key={idea}>{idea}</li>
                  ))}
                </ul>
              </div>
            )}
          </Card>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-slate-800/60 bg-slate-900/70">
          <h2 className="mb-4 text-sm font-semibold text-white">Інгредієнти</h2>
          <ul className="flex flex-col gap-2 text-sm text-slate-200">
            {recipe.ingredients.map((ingredient) => (
              <li key={ingredient.name} className="flex items-center justify-between rounded-2xl border border-slate-800/60 bg-slate-900/60 px-4 py-2">
                <span>{ingredient.name}</span>
                <span className="text-slate-400">
                  {ingredient.quantity} {ingredient.unit}
                  {ingredient.optional ? ' · опційно' : ''}
                </span>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="border-slate-800/60 bg-slate-900/70">
          <h2 className="mb-4 text-sm font-semibold text-white">Кроки приготування</h2>
          <ol className="flex flex-col gap-3 text-sm text-slate-200">
            {recipe.steps.map((step) => (
              <li key={step.id} className="rounded-2xl border border-slate-800/60 bg-slate-900/60 p-4">
                <div className="mb-2 flex items-center justify-between text-xs text-slate-400">
                  <span>Крок {step.order}</span>
                  {step.durationMinutes && (
                    <span className="flex items-center gap-1">
                      <Timer className="h-3.5 w-3.5 text-brand-300" /> {step.durationMinutes} хв
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-100">{step.instruction}</p>
                {step.tips && <p className="mt-2 text-xs text-slate-400">Порада: {step.tips}</p>}
              </li>
            ))}
          </ol>
        </Card>
      </div>

      <Card className="overflow-hidden border-slate-800/60 bg-slate-900/70">
        <h2 className="mb-3 text-sm font-semibold text-white">Відео-гайд</h2>
        <div className="relative aspect-video w-full overflow-hidden rounded-3xl">
          <iframe
            src={recipe.video.url}
            title={recipe.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="h-full w-full"
          />
        </div>
      </Card>
    </div>
  )
}

export default RecipeDetailPage
