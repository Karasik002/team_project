import { FormEvent, useEffect, useMemo, useState } from 'react';
import { FiMic, FiPlus, FiSparkles, FiVideo } from 'react-icons/fi';
import { IngredientInput, Recipe } from '../types';
import { generateRecipes, fitnessRecommendation, suggestNewIngredient } from '../services/recipeEngine';
import { useUserStore } from '../store/userStore';
import { usePantryStore } from '../store/pantryStore';
import { useGamificationStore } from '../store/gamificationStore';
import { useVoiceInput } from '../hooks/useVoiceInput';
import { formatDuration } from '../utils/time';

const chipClass = 'rounded-full bg-slate-800/70 px-3 py-1 text-xs text-slate-300';

const HomePage = () => {
  const profile = useUserStore((state) => state.profile);
  const toggleFavourite = useUserStore((state) => state.toggleFavouriteRecipe);
  const addToShoppingList = usePantryStore((state) => state.addToShoppingList);
  const unlockAchievement = useGamificationStore((state) => state.unlockAchievement);
  const voice = useVoiceInput();

  const [ingredients, setIngredients] = useState<IngredientInput[]>([
    { name: 'кіноа', quantity: '1 склянка' },
    { name: 'тофу', quantity: '200 г' },
    { name: 'шпинат', quantity: 'жменя' }
  ]);
  const [inputName, setInputName] = useState('');
  const [inputQuantity, setInputQuantity] = useState('');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (!voice.commands.length) return;
    const latest = voice.commands[voice.commands.length - 1];
    if (!latest?.transcript) return;
    const parsed = latest.transcript
      .split(/[,.;]/)
      .map((part) => part.trim())
      .filter(Boolean)
      .map((name) => ({ name }));
    if (parsed.length) {
      setIngredients((prev) => [...prev, ...parsed]);
      unlockAchievement('ach-voice-chef');
    }
  }, [voice.commands, unlockAchievement]);

  const handleAddIngredient = () => {
    if (!inputName.trim()) return;
    setIngredients((prev) => [...prev, { name: inputName.trim(), quantity: inputQuantity.trim() || undefined }]);
    setInputName('');
    setInputQuantity('');
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!ingredients.length) return;
    setIsGenerating(true);
    setTimeout(() => {
      const generated = generateRecipes(ingredients, profile);
      setRecipes(generated);
      setIsGenerating(false);
    }, 600);
  };

  const recommendedIngredient = useMemo(() => suggestNewIngredient(profile), [profile]);

  return (
    <div className="flex flex-col gap-6">
      <section className="glass-panel rounded-3xl p-6 shadow-soft">
        <header className="mb-6 flex flex-wrap items-center gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-slate-50">Що є на вашій кухні?</h2>
            <p className="text-sm text-slate-400">Введіть або надиктуйте інгредієнти — AI згенерує рецепти за кілька секунд.</p>
          </div>
          <button
            type="button"
            onClick={voice.listening ? voice.stop : voice.start}
            className={`ml-auto flex items-center gap-2 rounded-full border border-primary/40 px-4 py-2 text-sm transition ${
              voice.listening ? 'bg-primary text-slate-950' : 'bg-transparent text-primary hover:bg-primary/10'
            }`}
          >
            <FiMic />
            {voice.listening ? 'Зупинити запис' : voice.isSupported ? 'Надиктувати голосом' : 'Голос недоступний'}
          </button>
        </header>
        {voice.error && <p className="text-xs text-rose-400">{voice.error}</p>}
        {voice.transcript && (
          <div className="mb-6 rounded-2xl bg-slate-800/50 p-4 text-sm text-slate-200">
            <p className="text-xs uppercase text-slate-500">Поточний запис</p>
            <span>{voice.transcript}</span>
          </div>
        )}
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="grid gap-3 md:grid-cols-[2fr,1fr,auto]">
            <input
              value={inputName}
              onChange={(event) => setInputName(event.target.value)}
              placeholder="Наприклад, батат, сочевиця, базилік..."
              className="rounded-2xl border border-slate-700 bg-slate-900/60 px-4 py-3 text-sm text-slate-100 focus:border-primary focus:outline-none"
            />
            <input
              value={inputQuantity}
              onChange={(event) => setInputQuantity(event.target.value)}
              placeholder="Кількість (опційно)"
              className="rounded-2xl border border-slate-700 bg-slate-900/60 px-4 py-3 text-sm text-slate-100 focus:border-primary focus:outline-none"
            />
            <button
              type="button"
              onClick={handleAddIngredient}
              className="flex items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-medium text-slate-950 shadow-lg shadow-primary/30 transition hover:-translate-y-0.5"
            >
              <FiPlus /> Додати
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {ingredients.map((ingredient, index) => (
              <span key={`${ingredient.name}-${index}`} className={`${chipClass} flex items-center gap-2`}> 
                {ingredient.name}
                {ingredient.quantity && (
                  <span className="text-[10px] text-slate-500">{ingredient.quantity}</span>
                )}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <div className="text-xs text-slate-400">
              <p>Рекомендація шефа: додайте {recommendedIngredient}, щоб урізноманітнити смак.</p>
            </div>
            <button
              type="submit"
              disabled={isGenerating || !ingredients.length}
              className="ml-auto flex items-center gap-2 rounded-full bg-secondary px-5 py-2 text-sm font-medium text-slate-50 transition hover:bg-secondary/90 disabled:cursor-not-allowed disabled:bg-secondary/40"
            >
              <FiSparkles className={isGenerating ? 'animate-spin' : ''} />
              {isGenerating ? 'Генеруємо магію...' : 'Створити рецепти'}
            </button>
          </div>
        </form>
      </section>

      {recipes.length > 0 && (
        <section className="grid gap-6">
          {recipes.map((recipe) => (
            <article key={recipe.id} className="glass-panel grid gap-6 rounded-3xl p-6 shadow-soft md:grid-cols-[1.4fr,1fr]">
              <div className="space-y-4">
                <div className="relative h-56 w-full overflow-hidden rounded-3xl">
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                  <span className="absolute left-4 top-4 rounded-full bg-black/60 px-3 py-1 text-xs uppercase tracking-widest text-slate-100">
                    {recipe.cuisine}
                  </span>
                </div>
                <header className="flex flex-wrap items-start gap-4">
                  <div>
                    <h3 className="text-xl font-semibold text-slate-50">{recipe.title}</h3>
                    <p className="text-sm text-slate-400">{recipe.description}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleFavourite(recipe)}
                    className={`ml-auto rounded-full border px-4 py-1 text-xs ${
                      recipe.liked ? 'border-primary bg-primary/20 text-primary' : 'border-slate-700 text-slate-400 hover:border-primary hover:text-primary'
                    }`}
                  >
                    {recipe.liked ? 'В обраних' : 'Додати в обране'}
                  </button>
                </header>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl border border-slate-800/70 bg-slate-900/50 p-4 text-sm">
                    <p className="text-xs uppercase tracking-widest text-slate-500">БЖВ на порцію</p>
                    <div className="mt-2 grid grid-cols-2 gap-3 text-slate-200">
                      <div>
                        <p className="text-2xl font-semibold text-primary">{recipe.macros.calories}</p>
                        <span className="text-xs text-slate-500">ккал</span>
                      </div>
                      <div className="space-y-1 text-xs text-slate-400">
                        <p>Білок: <span className="text-slate-200">{recipe.macros.protein} г</span></p>
                        <p>Вуглеводи: <span className="text-slate-200">{recipe.macros.carbs} г</span></p>
                        <p>Жири: <span className="text-slate-200">{recipe.macros.fats} г</span></p>
                      </div>
                    </div>
                    <div className="mt-3 text-xs text-slate-400">
                      {fitnessRecommendation(profile, recipe.macros)}
                    </div>
                  </div>
                  <div className="rounded-2xl border border-slate-800/70 bg-slate-900/50 p-4 text-sm">
                    <p className="text-xs uppercase tracking-widest text-slate-500">Поради з подачі</p>
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-200">
                      {recipe.platingTips?.map((tip) => (
                        <li key={tip}>{tip}</li>
                      ))}
                    </ul>
                    {recipe.leftoverStrategy && (
                      <p className="mt-3 rounded-xl bg-slate-800/60 px-3 py-2 text-xs text-slate-300">
                        ♻️ {recipe.leftoverStrategy}
                      </p>
                    )}
                  </div>
                </div>
                {recipe.missingIngredients.length > 0 && (
                  <div className="rounded-2xl border border-amber-400/40 bg-amber-400/10 p-4 text-sm text-amber-200">
                    <p className="text-xs uppercase tracking-widest text-amber-300">Уникаємо алергенів</p>
                    <p className="mt-1">AI вилучив інгредієнти, які вам не підходять: {recipe.missingIngredients.join(', ')}.</p>
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-4">
                <div className="overflow-hidden rounded-3xl border border-slate-800/60 bg-slate-900/40">
                  <div className="relative pt-[56%]">
                    <iframe
                      src={recipe.videoUrl}
                      title={recipe.title}
                      className="absolute inset-0 h-full w-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                  <div className="flex items-center gap-2 p-3 text-xs text-slate-400">
                    <FiVideo /> Кроки синхронізовані з відео-гайдом
                  </div>
                </div>
                <div className="rounded-3xl border border-slate-800/60 bg-slate-900/40 p-4 text-sm">
                  <p className="text-xs uppercase tracking-widest text-slate-500">Покрокова інструкція</p>
                  <ol className="mt-3 space-y-3">
                    {recipe.steps.map((step, index) => (
                      <li key={step.title} className="rounded-2xl bg-slate-800/40 p-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-slate-50">Крок {index + 1}: {step.title}</span>
                          {step.durationMinutes && (
                            <span className="text-xs text-slate-500">{formatDuration(step.durationMinutes)}</span>
                          )}
                        </div>
                        <p className="mt-1 text-slate-300">{step.detail}</p>
                        {step.tips && (
                          <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-slate-400">
                            {step.tips.map((tip) => (
                              <li key={tip}>{tip}</li>
                            ))}
                          </ul>
                        )}
                      </li>
                    ))}
                  </ol>
                </div>
                <div className="rounded-3xl border border-slate-800/60 bg-slate-900/40 p-4 text-sm text-slate-300">
                  <p className="text-xs uppercase tracking-widest text-slate-500">Улюблені теги</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {recipe.tags.map((tag) => (
                      <span key={tag} className={chipClass}>#{tag}</span>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => addToShoppingList('Запас спецій', 'поповнити', 'рекомендація')}
                    className="mt-4 w-full rounded-2xl bg-primary/10 p-3 text-xs text-primary transition hover:bg-primary/20"
                  >
                    Додати спеції до списку покупок
                  </button>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}
    </div>
  );
};

export default HomePage;
