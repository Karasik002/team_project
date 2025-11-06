import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { FiActivity, FiBookOpen, FiHeart, FiTarget } from 'react-icons/fi';
import { Allergy, DietPreference, FitnessGoal, NutritionGoal } from '../types';
import { useUserStore } from '../store/userStore';

type ProfileFormValues = {
  allergies: Allergy[];
  diets: DietPreference[];
  goal: FitnessGoal;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
};

const allAllergies: Allergy[] = ['арахіс', 'морепродукти', 'глютен', 'молоко', 'яйця', 'соєві'];
const allDiets: DietPreference[] = ['веган', 'кето', 'вегетаріанець', 'без глютену', 'без лактози'];
const fitnessGoals: FitnessGoal[] = ['підтримка ваги', 'набір мязів', 'схуднення'];

const ProfilePage = () => {
  const profile = useUserStore((state) => state.profile);
  const cookingHistory = useUserStore((state) => state.cookingHistory);
  const favourites = useUserStore((state) => Object.values(state.favouriteRecipes));
  const setAllergies = useUserStore((state) => state.setAllergies);
  const updateGoals = useUserStore((state) => state.updateGoals);

  const { handleSubmit, register, watch, setValue } = useForm<ProfileFormValues>({
    defaultValues: {
      allergies: profile.allergies,
      diets: profile.diets,
      goal: profile.goals.goal,
      calories: profile.goals.calories,
      protein: profile.goals.protein,
      carbs: profile.goals.carbs,
      fats: profile.goals.fats
    }
  });

  const currentGoal = watch('goal');

  const goalSummary = useMemo(() => {
    const goals: Record<FitnessGoal, string> = {
      'підтримка ваги': 'Баланс раціону зі збереженням стабільної ваги та енергії.',
      'набір мязів': 'Пріоритет на білки та складні вуглеводи для росту м’язів.',
      схуднення: 'Контроль калорій із високим вмістом клітковини та білку.'
    };
    return goals[currentGoal];
  }, [currentGoal]);

  const onSubmit = (values: ProfileFormValues) => {
    setAllergies(values.allergies);
    const goal: NutritionGoal = {
      calories: Number(values.calories),
      protein: Number(values.protein),
      carbs: Number(values.carbs),
      fats: Number(values.fats),
      goal: values.goal
    };
    updateGoals(goal);
  };

  const toggleCheckboxArray = <T extends Allergy | DietPreference>(field: 'allergies' | 'diets', value: T) => {
    const current = watch(field) as T[];
    const exists = current.includes(value);
    const updated = exists ? current.filter((item) => item !== value) : [...current, value];
    setValue(field, updated as any);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1.3fr,1fr]">
      <section className="glass-panel rounded-3xl p-6 shadow-soft">
        <header className="mb-6">
          <h2 className="text-2xl font-semibold text-slate-50">Персональні параметри</h2>
          <p className="text-sm text-slate-400">AI враховує ваші вподобання, щоб щодня пропонувати нові ідеї.</p>
        </header>
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <h3 className="text-sm font-semibold text-slate-300">Алергії</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {allAllergies.map((allergy) => {
                const selected = watch('allergies').includes(allergy);
                return (
                  <button
                    type="button"
                    key={allergy}
                    onClick={() => toggleCheckboxArray('allergies', allergy)}
                    className={`rounded-full border px-4 py-2 text-xs transition ${
                      selected ? 'border-rose-400 bg-rose-500/20 text-rose-200' : 'border-slate-700 text-slate-300 hover:border-rose-400'
                    }`}
                  >
                    {allergy}
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-300">Дієтичні вподобання</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {allDiets.map((diet) => {
                const selected = watch('diets').includes(diet);
                return (
                  <button
                    type="button"
                    key={diet}
                    onClick={() => toggleCheckboxArray('diets', diet)}
                    className={`rounded-full border px-4 py-2 text-xs transition ${
                      selected ? 'border-emerald-400 bg-emerald-500/20 text-emerald-200' : 'border-slate-700 text-slate-300 hover:border-emerald-400'
                    }`}
                  >
                    {diet}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="rounded-3xl border border-slate-800/60 bg-slate-900/40 p-4">
            <h3 className="text-sm font-semibold text-slate-300">Фітнес-цілі</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {fitnessGoals.map((goal) => (
                <label key={goal} className={`cursor-pointer rounded-full border px-4 py-2 text-xs transition ${
                  watch('goal') === goal ? 'border-primary bg-primary/20 text-primary' : 'border-slate-700 text-slate-300 hover:border-primary'
                }`}>
                  <input type="radio" value={goal} {...register('goal')} className="hidden" />
                  {goal}
                </label>
              ))}
            </div>
            <p className="mt-3 text-xs text-slate-400">{goalSummary}</p>
            <div className="mt-4 grid gap-3 md:grid-cols-4">
              <label className="text-xs text-slate-400">
                Калорії
                <input type="number" min={1200} max={4000} step={50} {...register('calories', { valueAsNumber: true })} className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm text-slate-100 focus:border-primary focus:outline-none" />
              </label>
              <label className="text-xs text-slate-400">
                Білок
                <input type="number" min={40} max={250} step={5} {...register('protein', { valueAsNumber: true })} className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm text-slate-100 focus:border-primary focus:outline-none" />
              </label>
              <label className="text-xs text-slate-400">
                Вуглеводи
                <input type="number" min={40} max={400} step={5} {...register('carbs', { valueAsNumber: true })} className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm text-slate-100 focus:border-primary focus:outline-none" />
              </label>
              <label className="text-xs text-slate-400">
                Жири
                <input type="number" min={20} max={150} step={5} {...register('fats', { valueAsNumber: true })} className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm text-slate-100 focus:border-primary focus:outline-none" />
              </label>
            </div>
          </div>
          <button type="submit" className="rounded-2xl bg-secondary px-5 py-3 text-sm font-medium text-slate-50 transition hover:bg-secondary/90">Оновити профіль</button>
        </form>
      </section>

      <aside className="glass-panel flex flex-col gap-5 rounded-3xl p-6 shadow-soft">
        <div className="rounded-3xl border border-slate-800/60 bg-slate-900/40 p-4">
          <header className="flex items-center gap-3 text-slate-200">
            <FiTarget />
            <h3 className="text-sm font-semibold">Прогрес цілей</h3>
          </header>
          <div className="mt-4 space-y-3 text-xs text-slate-400">
            <div>
              <p>Середня калорійність рецептів: <span className="text-slate-100">{Math.round(profile.goals.calories * 0.92)} ккал</span></p>
              <p className="text-[11px] text-slate-500">AI балансує енергетичну цінність відповідно до вашої цілі.</p>
            </div>
            <div>
              <p>Середній білок: <span className="text-slate-100">{Math.round(profile.goals.protein * 0.95)} г</span></p>
              <p className="text-[11px] text-slate-500">Рекомендовано додати бобові у два прийоми їжі.</p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-800/60 bg-slate-900/40 p-4">
          <header className="flex items-center gap-3 text-slate-200">
            <FiHeart />
            <h3 className="text-sm font-semibold">Улюблені рецепти</h3>
          </header>
          <div className="mt-3 space-y-3 text-sm text-slate-300">
            {favourites.length ? (
              favourites.map((recipe) => (
                <div key={recipe.id} className="rounded-2xl bg-slate-800/40 p-3">
                  <p className="font-medium text-slate-100">{recipe.title}</p>
                  <p className="text-xs text-slate-500">{recipe.cuisine} • {recipe.macros.calories} ккал</p>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500">Додайте страви до обраного на головній сторінці.</p>
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-800/60 bg-slate-900/40 p-4">
          <header className="flex items-center gap-3 text-slate-200">
            <FiBookOpen />
            <h3 className="text-sm font-semibold">Журнал приготувань</h3>
          </header>
          <ul className="mt-3 space-y-2 text-xs text-slate-400">
            {cookingHistory.length ? (
              cookingHistory.slice(0, 5).map((item) => (
                <li key={item.recipeId} className="rounded-2xl bg-slate-800/40 p-3">
                  <p className="text-slate-100">{item.recipeId}</p>
                  <p className="text-[11px] text-slate-500">{new Date(item.cookedAt).toLocaleString('uk-UA')}</p>
                </li>
              ))
            ) : (
              <li className="text-[11px] text-slate-500">Ще не було приготувань. Сформуйте рецепт та позначте як виконаний.</li>
            )}
          </ul>
        </div>

        <div className="rounded-3xl border border-slate-800/60 bg-slate-900/40 p-4">
          <header className="flex items-center gap-3 text-slate-200">
            <FiActivity />
            <h3 className="text-sm font-semibold">Рівень кулінарної майстерності</h3>
          </header>
          <p className="mt-3 text-sm text-slate-300">Ваш поточний рівень — <span className="font-semibold text-primary">{profile.experienceLevel}</span>. AI підлаштовує складність рецептів.</p>
        </div>
      </aside>
    </div>
  );
};

export default ProfilePage;
