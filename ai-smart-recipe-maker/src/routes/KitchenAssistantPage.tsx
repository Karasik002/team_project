import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft, Pause, Play, Repeat2, Volume2 } from 'lucide-react'
import Card from '../components/core/Card'
import Button from '../components/core/Button'
import Badge from '../components/core/Badge'
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis'
import { useRecipeStore } from '../stores/useRecipeStore'

interface LocationState {
  recipeId?: string
}

const KitchenAssistantPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state as LocationState | undefined
  const { generatedRecipes } = useRecipeStore((store) => store)
  const recipe = useMemo(() => {
    if (state?.recipeId) {
      return generatedRecipes.find((item) => item.id === state.recipeId)
    }
    return generatedRecipes[0]
  }, [generatedRecipes, state?.recipeId])

  const [stepIndex, setStepIndex] = useState(0)
  const [autoPlay, setAutoPlay] = useState(true)
  const { speak, cancel, supported, speaking } = useSpeechSynthesis()

  useEffect(() => {
    if (!recipe) return
    if (!supported) return
    if (!autoPlay) return
    const step = recipe.steps[stepIndex]
    if (step) {
      speak(`${step.order}. ${step.instruction}`)
    }
    // cancel on unmount
    return () => cancel()
  }, [recipe, stepIndex, autoPlay, speak, cancel, supported])

  if (!recipe) {
    return (
      <Card className="flex flex-col items-center gap-3 border-dashed border-slate-800/70 bg-slate-900/60 py-14 text-center">
        <p className="text-sm text-slate-300">Немає активного рецепту. Згенеруйте рецепт і відкрийте кухонний режим з його сторінки.</p>
        <Button onClick={() => navigate('/recipes')}>До рецептів</Button>
      </Card>
    )
  }

  const currentStep = recipe.steps[stepIndex]

  const goToStep = (index: number) => {
    cancel()
    setStepIndex(index)
  }

  const handleNext = () => {
    if (stepIndex < recipe.steps.length - 1) {
      goToStep(stepIndex + 1)
    }
  }

  const handlePrev = () => {
    if (stepIndex > 0) {
      goToStep(stepIndex - 1)
    }
  }

  const replayStep = () => {
    cancel()
    speak(`${currentStep.order}. ${currentStep.instruction}`)
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-3 rounded-3xl border border-slate-800/70 bg-slate-900/70 p-6 md:flex-row md:items-center md:justify-between">
        <div>
          <Button variant="ghost" size="sm" icon={<ArrowLeft className="h-4 w-4" />} onClick={() => navigate(-1)}>
            Назад
          </Button>
          <h1 className="mt-2 text-2xl font-semibold text-white">Асистент на кухні</h1>
          <p className="text-sm text-slate-300">{recipe.title}</p>
        </div>
        <Badge variant="info">Крок {currentStep.order} із {recipe.steps.length}</Badge>
      </header>

      <section className="grid gap-6 lg:grid-cols-[1.3fr,1fr]">
        <Card className="border-slate-800/70 bg-slate-900/70">
          <h2 className="mb-4 text-sm font-semibold text-white">Поточний крок</h2>
          <div className="flex flex-col gap-4">
            <div className="rounded-3xl border border-slate-800/60 bg-slate-900/60 p-6 text-lg text-slate-100">
              {currentStep.order}. {currentStep.instruction}
            </div>
            {currentStep.tips && <p className="text-sm text-slate-400">Порада: {currentStep.tips}</p>}
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="secondary" icon={<Volume2 className="h-4 w-4" />} onClick={replayStep}>
                Озвучити ще раз
              </Button>
              <Button variant="ghost" icon={speaking ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />} onClick={() => {
                if (speaking) {
                  cancel()
                  setAutoPlay(false)
                } else {
                  setAutoPlay(true)
                  replayStep()
                }
              }}>
                {speaking ? 'Пауза' : 'Продовжити автоозвучку'}
              </Button>
              <Button variant="ghost" icon={<Repeat2 className="h-4 w-4" />} onClick={() => goToStep(0)}>
                Почати спочатку
              </Button>
            </div>
          </div>
        </Card>

        <Card className="border-slate-800/70 bg-slate-900/70">
          <h2 className="mb-4 text-sm font-semibold text-white">Керування кроками</h2>
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <Button variant="secondary" onClick={handlePrev} disabled={stepIndex === 0}>
                Назад
              </Button>
              <Button variant="secondary" onClick={handleNext} disabled={stepIndex === recipe.steps.length - 1}>
                Далі
              </Button>
            </div>
            <div className="grid max-h-64 gap-2 overflow-y-auto rounded-2xl border border-slate-800/60 bg-slate-900/50 p-3 text-sm text-slate-200">
              {recipe.steps.map((step, index) => (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => goToStep(index)}
                  className={`rounded-xl px-3 py-2 text-left transition ${index === stepIndex ? 'bg-brand-500/20 text-brand-100' : 'bg-transparent hover:bg-slate-800/60'}`}
                >
                  {step.order}. {step.instruction}
                </button>
              ))}
            </div>
          </div>
        </Card>
      </section>

      <section className="grid gap-4 rounded-3xl border border-slate-800/70 bg-slate-900/70 p-6 text-sm text-slate-300">
        <h2 className="text-sm font-semibold text-white">Чек-лист перед стартом</h2>
        <ul className="list-disc space-y-1 pl-6">
          <li>Підготуйте всі інгредієнти: {recipe.ingredients.slice(0, 5).map((ingredient) => ingredient.name).join(', ')}...</li>
          <li>Перевірте наявність кухонних інструментів для сьогоднішніх кроків.</li>
          <li>Натискайте «Далі», коли завершите поточний етап, щоб AI стежив за темпом.</li>
        </ul>
      </section>
    </div>
  )
}

export default KitchenAssistantPage
