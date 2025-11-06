import type { FormEvent } from 'react'
import { useEffect, useMemo, useState } from 'react'
import { Mic, MicOff, RefreshCw, Sparkles } from 'lucide-react'
import Button from '../core/Button'
import Card from '../core/Card'
import Badge from '../core/Badge'
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition'
import { usePantryStore } from '../../stores/usePantryStore'

interface IngredientInputProps {
  onGenerate: (options: {
    ingredients: string[]
    useLeftovers: boolean
    prioritizeBudget: boolean
    servings: number
  }) => void
  loading: boolean
  defaultIngredients?: string[]
}

const IngredientInput = ({ onGenerate, loading, defaultIngredients = [] }: IngredientInputProps) => {
  const [inputValue, setInputValue] = useState(defaultIngredients.join(', '))
  const [useLeftovers, setUseLeftovers] = useState(true)
  const [prioritizeBudget, setPrioritizeBudget] = useState(false)
  const [servings, setServings] = useState(2)
  const { transcript, isListening, startListening, stopListening, resetTranscript, isSupported, error } = useSpeechRecognition()
  const pantryItems = usePantryStore((state) => state.items)

  useEffect(() => {
    if (transcript && !isListening) {
      setInputValue((prev) => {
        if (!prev) return transcript
        return `${prev}, ${transcript}`
      })
      resetTranscript()
    }
  }, [isListening, transcript, resetTranscript])

  useEffect(() => {
    if (defaultIngredients.length) {
      setInputValue(defaultIngredients.join(', '))
    }
  }, [defaultIngredients])

  const quickPantryIngredients = useMemo(
    () => pantryItems.slice(0, 6).map((item) => item.name),
    [pantryItems],
  )

  const parsedIngredients = inputValue
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onGenerate({
      ingredients: parsedIngredients,
      useLeftovers,
      prioritizeBudget,
      servings,
    })
  }

  const handleAddIngredient = (ingredient: string) => {
    if (!inputValue.includes(ingredient)) {
      setInputValue((prev) => (prev ? `${prev}, ${ingredient}` : ingredient))
    }
  }

  return (
    <Card className="relative overflow-hidden border-brand-500/30 bg-slate-900/80">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-brand-500/10 via-slate-900 to-slate-950" aria-hidden />
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white">Які інгредієнти є вдома?</h2>
              <p className="text-sm text-slate-300">Введіть список через кому або скористайтесь голосовим введенням.</p>
            </div>
            <Badge variant="info" className="hidden lg:inline-flex">AI Ready</Badge>
          </div>
          <div className="relative">
            <textarea
              className="h-32 w-full resize-none rounded-2xl border border-slate-700 bg-slate-900/70 px-4 py-3 text-sm text-slate-100 shadow-inner shadow-slate-950/40 focus:border-brand-500 focus:outline-none"
              placeholder="Наприклад: лосось, шпинат, кіноа, авокадо"
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
            />
            <div className="absolute bottom-3 right-3 flex items-center gap-2">
              {isSupported && (
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  icon={isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  onClick={() => (isListening ? stopListening() : startListening())}
                >
                  {isListening ? 'Зупинити' : 'Голос'}
                </Button>
              )}
              <Button type="button" variant="ghost" size="sm" icon={<RefreshCw className="h-4 w-4" />} onClick={() => setInputValue('')}>
                Очистити
              </Button>
            </div>
          </div>
          {error && <p className="text-xs text-amber-300">{error}</p>}
        </div>

        {quickPantryIngredients.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {quickPantryIngredients.map((ingredient) => (
              <button
                key={ingredient}
                type="button"
                className="rounded-full border border-brand-500/30 bg-brand-500/10 px-3 py-1 text-xs font-medium text-brand-100 transition hover:border-brand-400 hover:bg-brand-400/20"
                onClick={() => handleAddIngredient(ingredient)}
              >
                + {ingredient}
              </button>
            ))}
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-3">
          <label className="flex items-center justify-between rounded-2xl border border-slate-800/70 bg-slate-900/60 p-4 text-sm">
            <span className="font-medium text-slate-200">Використати залишки</span>
            <input
              type="checkbox"
              checked={useLeftovers}
              onChange={() => setUseLeftovers((prev) => !prev)}
              className="h-5 w-9 cursor-pointer appearance-none rounded-full bg-slate-700 transition checked:bg-brand-500"
            />
          </label>
          <label className="flex items-center justify-between rounded-2xl border border-slate-800/70 bg-slate-900/60 p-4 text-sm">
            <span className="font-medium text-slate-200">Економний режим</span>
            <input
              type="checkbox"
              checked={prioritizeBudget}
              onChange={() => setPrioritizeBudget((prev) => !prev)}
              className="h-5 w-9 cursor-pointer appearance-none rounded-full bg-slate-700 transition checked:bg-brand-500"
            />
          </label>
          <label className="flex flex-col gap-2 rounded-2xl border border-slate-800/70 bg-slate-900/60 p-4 text-sm">
            <span className="font-medium text-slate-200">Порції: {servings}</span>
            <input
              type="range"
              min={1}
              max={6}
              value={servings}
              onChange={(event) => setServings(Number(event.target.value))}
              className="accent-brand-500"
            />
          </label>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Sparkles className="h-4 w-4 text-brand-300" />
            <span>AI підбере рецепти з фото, відео, БЖВ та порадами подачі.</span>
          </div>
          <Button type="submit" disabled={loading || parsedIngredients.length === 0} icon={<Sparkles className="h-4 w-4" />}>
            {loading ? 'Генеруємо...' : 'Згенерувати рецепти'}
          </Button>
        </div>
      </form>
    </Card>
  )
}

export default IngredientInput
