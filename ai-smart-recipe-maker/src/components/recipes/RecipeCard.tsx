import { ArrowRight, Clock, Flame, Heart, ListPlus, Sparkles, UtensilsCrossed, Video } from 'lucide-react'
import type { Recipe } from '../../types'
import Card from '../core/Card'
import Badge from '../core/Badge'
import Button from '../core/Button'

interface RecipeCardProps {
  recipe: Recipe
  onView: (recipe: Recipe) => void
  onAddToShoppingList: (recipe: Recipe) => void
  isFavorite: boolean
  onToggleFavorite: (recipeId: string) => void
}

const RecipeCard = ({ recipe, onView, onAddToShoppingList, isFavorite, onToggleFavorite }: RecipeCardProps) => (
  <Card className="grid gap-6 border-slate-800/50 bg-slate-900/70 lg:grid-cols-[280px,1fr]">
    <div className="relative overflow-hidden rounded-2xl">
      <img src={recipe.image} alt={recipe.title} className="h-full w-full object-cover" />
      <Badge variant="info" className="absolute left-3 top-3 flex items-center gap-1">
        <Video className="h-3.5 w-3.5" /> Відео-гайд
      </Badge>
      <button
        type="button"
        onClick={() => onToggleFavorite(recipe.id)}
        className="absolute right-3 top-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-900/70 text-rose-300 transition hover:text-rose-200"
      >
        <Heart className={`h-5 w-5 ${isFavorite ? 'fill-rose-400 text-rose-400' : ''}`} />
      </button>
    </div>

    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="default" className="gap-1">
            <Flame className="h-3.5 w-3.5" /> {recipe.nutrition.calories} ккал
          </Badge>
          <Badge variant="success">Білки {recipe.nutrition.protein} г</Badge>
          <Badge variant="warning">Вуглеводи {recipe.nutrition.carbs} г</Badge>
          <Badge variant="info">Жири {recipe.nutrition.fats} г</Badge>
        </div>
        <h3 className="text-2xl font-semibold text-white">{recipe.title}</h3>
        <p className="text-sm text-slate-300">{recipe.description}</p>
      </div>

      <div className="grid gap-3 text-sm text-slate-300 md:grid-cols-3">
        <div className="flex items-center gap-2 rounded-2xl border border-slate-800/60 bg-slate-900/60 px-3 py-2">
          <Clock className="h-4 w-4 text-brand-300" />
          <div>
            <p className="text-xs text-slate-400">Час</p>
            <p className="font-medium text-slate-100">{recipe.totalTime} хв</p>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-2xl border border-slate-800/60 bg-slate-900/60 px-3 py-2">
          <UtensilsCrossed className="h-4 w-4 text-brand-300" />
          <div>
            <p className="text-xs text-slate-400">Порції</p>
            <p className="font-medium text-slate-100">{recipe.servings}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-2xl border border-slate-800/60 bg-slate-900/60 px-3 py-2">
          <Sparkles className="h-4 w-4 text-brand-300" />
          <div>
            <p className="text-xs text-slate-400">Новизна AI</p>
            <p className="font-medium text-slate-100">{Math.round(recipe.noveltyScore * 100)}%</p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {recipe.suitableFor.slice(0, 3).map((tag) => (
          <Badge key={tag} variant="default" className="bg-brand-500/10 text-brand-100">
            {tag}
          </Badge>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button variant="primary" icon={<ArrowRight className="h-4 w-4" />} onClick={() => onView(recipe)}>
          Деталі & Кухонний режим
        </Button>
        <Button variant="secondary" icon={<ListPlus className="h-4 w-4" />} onClick={() => onAddToShoppingList(recipe)}>
          Додати відсутні інгредієнти
        </Button>
      </div>
    </div>
  </Card>
)

export default RecipeCard
