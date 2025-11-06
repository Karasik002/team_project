import { IngredientInput, Recipe, RecipeStep, UserProfile } from '../types';
import { nanoid } from '../utils/nanoid';

const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1481931098730-318b6f776db0?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80'
];

const FALLBACK_VIDEOS = [
  'https://www.youtube.com/embed/6q-KGw0PQ7M',
  'https://www.youtube.com/embed/9M5pXpoHbLQ',
  'https://www.youtube.com/embed/UG93EfwrnKk'
];

const cuisines = ['італійська', 'середземноморська', 'азійська', 'українська', 'фьюжн', 'мексиканська'];

const difficultyFromIngredients = (ingredients: IngredientInput[]): Recipe['difficulty'] => {
  if (ingredients.length <= 4) return 'easy';
  if (ingredients.length <= 8) return 'medium';
  return 'hard';
};

const baseSteps: RecipeStep[] = [
  {
    title: 'Підготовка інгредієнтів',
    detail: 'Промийте, очистіть та наріжте інгредієнти відповідно до рецепту.',
    tips: ['Завжди тримайте під рукою окрему дошку для сирого м’яса.'],
    durationMinutes: 10
  },
  {
    title: 'Основне приготування',
    detail: 'Готуйте на середньому вогні, періодично помішуючи. Додавайте спеції згідно вподобань.',
    tips: ['Використовуйте таймер, щоб не переварити овочі.'],
    durationMinutes: 20
  },
  {
    title: 'Подача',
    detail: 'Сервіруйте страву, додайте гарнір та соуси. Оформіть тарілку для ефектної подачі.',
    tips: ['Додайте свіжі трави та кілька крапель оливкової олії.'],
    durationMinutes: 5
  }
];

const randomItem = <T,>(items: T[]): T => items[Math.floor(Math.random() * items.length)];

const estimateMacros = (ingredients: IngredientInput[], profile: UserProfile) => {
  const baseCalories = 250 + ingredients.length * 60;
  const protein = Math.round(baseCalories * 0.25 + profile.goals.protein * 0.1);
  const carbs = Math.round(baseCalories * 0.4);
  const fats = Math.round(baseCalories * 0.35);
  return { calories: baseCalories, protein, carbs, fats };
};

const detectMissingIngredients = (ingredients: IngredientInput[], profile: UserProfile): string[] => {
  const banned = new Set(profile.bannedIngredients.map((name) => name.toLowerCase()));
  return ingredients
    .map((item) => item.name.toLowerCase())
    .filter((name) => banned.has(name));
};

const leftoverStrategies = [
  'Зберігайте у герметичному контейнері до 3 днів та використайте як начинку для тако.',
  'Заморозьте порційно, а потім розігрійте на пару для збереження текстури.',
  'Перетворіть на салат наступного дня, додавши свіжу зелень та зернові.',
  'Сформуйте кульки, підсмажте на пательні та подавайте з соусом кімчі.'
];

const platingIdeas = [
  'Сервіруйте на плоскому блюді, прикрасьте мікрозеленню та слайсами редиски.',
  'Додайте спіральки з моркви та краплі пюре з зеленого горошку.',
  'Створіть контраст: світлий соус на темній тарілці та навпаки.',
  'Використовуйте глибоку тарілку та додайте хрусткі крунчі зверху.'
];

const tagsFromDiet = (profile: UserProfile): string[] => [
  ...profile.diets,
  profile.goals.goal,
  profile.experienceLevel
];

export const generateRecipes = (
  ingredients: IngredientInput[],
  profile: UserProfile
): Recipe[] => {
  if (!ingredients.length) return [];

  const results = Array.from({ length: 3 }).map((_, index) => {
    const macros = estimateMacros(ingredients, profile);
    const missing = detectMissingIngredients(ingredients, profile);
    const cuisine = randomItem(cuisines);
    return {
      id: nanoid('recipe'),
      title: `${cuisine} AI-страва #${index + 1}`,
      description: `Страва, що максимально використовує ваші інгредієнти та відповідає вподобанням ${profile.name}.` ,
      image: randomItem(FALLBACK_IMAGES),
      videoUrl: randomItem(FALLBACK_VIDEOS),
      servings: profile.goals.goal === 'набір мязів' ? 2 : 3,
      difficulty: difficultyFromIngredients(ingredients),
      cuisine,
      macros,
      steps: baseSteps.map((step, stepIndex) => ({
        ...step,
        title: stepIndex === 1 ? `${step.title}: ${cuisine}` : step.title
      })),
      missingIngredients: missing,
      tags: [...new Set([...tagsFromDiet(profile), cuisine])],
      leftoverStrategy: randomItem(leftoverStrategies),
      platingTips: [randomItem(platingIdeas), randomItem(platingIdeas)],
      sustainabilityScore: Math.round(Math.random() * 20 + 80),
      createdAt: new Date().toISOString()
    } satisfies Recipe;
  });

  return results;
};

export const suggestNewIngredient = (profile: UserProfile): string => {
  const ideas = [
    'кінва',
    'копчена паприка',
    'нутова паста',
    'кокосові аміно',
    'чорна квасоля'
  ];
  return randomItem(ideas);
};

export const fitnessRecommendation = (profile: UserProfile, macros: Recipe['macros']) => {
  const calorieDelta = profile.goals.calories - macros.calories;
  if (calorieDelta > 150) {
    return 'Додайте до страви гарнір з кіноа або запеченого батату для досягнення калорійної цілі.';
  }
  if (calorieDelta < -150) {
    return 'Розгляньте варіант зменшити розмір порції або додати салат зі свіжих овочів.';
  }
  return 'Чудова відповідність вашим фітнес-цілям! Додайте післятренувальний протеїновий смузі для балансу.';
};
