import type { Allergy, DietaryPreference, RecipeSuggestion } from '../types'

export interface RecipeTemplate {
  id: string
  title: string
  cuisine: string
  baseDescription: string
  heroImage: string
  video: {
    platform: 'youtube' | 'vimeo' | 'loom' | 'internal'
    url: string
  }
  difficulty: 'easy' | 'medium' | 'hard'
  tags: string[]
  matches: string[]
  dietCompatibility: DietaryPreference[]
  allergySafe: Allergy[]
  defaultServings: number
  totalTime: number
  activeTime: number
  steps: {
    instruction: string
    durationMinutes?: number
    tip?: string
  }[]
  suggestions: RecipeSuggestion[]
  leftoverIdeas: string[]
  platingTips: string[]
}

export const recipeTemplates: RecipeTemplate[] = [
  {
    id: 'citrus-salmon-bowl',
    title: 'Цитрусовий лосось із кіноа та зеленню',
    cuisine: 'Скандинавська',
    baseDescription:
      'Ніжне філе лосося, запечене під цитрусовою глазур\'ю та подане з теплим салатом із кіноа, шпинату та авокадо.',
    heroImage: 'https://images.unsplash.com/photo-1604908176987-5584c4d4b3d7?auto=format&fit=crop&w=1200&q=80',
    video: {
      platform: 'youtube',
      url: 'https://www.youtube.com/embed/6yFkaynPWa4?rel=0',
    },
    difficulty: 'medium',
    tags: ['омега-3', 'високий білок', 'вечеря'],
    matches: ['лосось', 'квінуа', 'шпинат', 'авокадо'],
    dietCompatibility: ['omnivore', 'pescatarian', 'keto', 'gluten-free'],
    allergySafe: ['gluten'],
    defaultServings: 2,
    totalTime: 35,
    activeTime: 20,
    steps: [
      {
        instruction: 'Змішайте сік лайма, оливкову олію та спеції. Замаринуйте лосося 10 хв.',
        durationMinutes: 10,
        tip: 'Додайте цедру лайма для більш насиченого аромату.',
      },
      {
        instruction: 'Варіть кіноа в овочевому бульйоні 15 хв до готовності.',
        durationMinutes: 15,
      },
      {
        instruction: 'Запікайте лосося при 200°C 12 хв. Останні 2 хвилини вмикайте гриль.',
        durationMinutes: 12,
      },
      {
        instruction: 'Змішайте кіноа зі шпинатом, авокадо та томатами чері. Полийте соусом.',
      },
    ],
    suggestions: [
      {
        pairing: 'Напій',
        description: 'Сухе біле вино Совіньйон Блан або лимонад із м\'ятою.',
      },
      {
        pairing: 'Гарнір',
        description: 'Хрусткі слайси солодкої картоплі, запечені з розмарином.',
      },
    ],
    leftoverIdeas: ['Зробіть поке-боули з холодним лососем і свіжими овочами.', 'Перетворіть залишки в пасту з вершковим соусом.'],
    platingTips: ['Використайте глибоку тарілку, виклавши кіноа гніздом.', 'Полийте лосося глазур\'ю та посипте кунжутом.'],
  },
  {
    id: 'vegan-umami-bowl',
    title: 'Веганський боул із тофу та кунжутним соусом',
    cuisine: 'Азійська ф\'южн',
    baseDescription:
      'Хрусткий запечений тофу з ароматним кунжутним соусом, різнокольоровими овочами та коричневим рисом.',
    heroImage: 'https://images.unsplash.com/photo-1542444592-0ce7ed214d4a?auto=format&fit=crop&w=1200&q=80',
    video: {
      platform: 'youtube',
      url: 'https://www.youtube.com/embed/E7yVScUZy6I?rel=0',
    },
    difficulty: 'easy',
    tags: ['веган', 'бюджетно', 'клітковина'],
    matches: ['тофу', 'коричневий рис', 'броколі', 'морква'],
    dietCompatibility: ['vegan', 'vegetarian', 'pescatarian'],
    allergySafe: ['gluten', 'dairy', 'eggs'],
    defaultServings: 3,
    totalTime: 30,
    activeTime: 20,
    steps: [
      {
        instruction: 'Запікайте кубики тофу з крохмалем і соєвим соусом 20 хв до хрусту.',
        durationMinutes: 20,
      },
      {
        instruction: 'Підготуйте овочі: подрібніть броколі, моркву та перець, злегка припарте.',
        durationMinutes: 10,
      },
      {
        instruction: 'Варіть коричневий рис у пропорції 1:2 протягом 25 хв або скористайтесь рисоваркою.',
        durationMinutes: 25,
      },
      {
        instruction: 'Змішайте тахіні, соєвий соус, лайм і імбир для кремового соусу.',
      },
    ],
    suggestions: [
      {
        pairing: 'Гарнір',
        description: 'Подайте зі свіжим салатом із редьки дайкон і м\'яти.',
      },
      {
        pairing: 'Напій',
        description: 'Матча-лате на мигдальному молоці.',
      },
    ],
    leftoverIdeas: ['Сформуйте спрінг-роли з рисовими паперами.', 'Додайте до ранкового омлету (якщо не веган).'],
    platingTips: ['Викладіть компоненти секторами, щоб показати кольори.', 'Посипте смаженим кунжутом і зеленою цибулею.'],
  },
  {
    id: 'mediterranean-chickpea',
    title: 'Середземноморське рагу з нутом та овочами',
    cuisine: 'Середземноморська',
    baseDescription:
      'Тепле рагу з нутом, томатами та ароматними спеціями, подане з цільнозерновим кускусом.',
    heroImage: 'https://images.unsplash.com/photo-1487004122274-9831d2449364?auto=format&fit=crop&w=1200&q=80',
    video: {
      platform: 'youtube',
      url: 'https://www.youtube.com/embed/N4bBQf2V9cE?rel=0',
    },
    difficulty: 'easy',
    tags: ['високий білок', 'без глютену', 'обід'],
    matches: ['нут', 'томат', 'шпинат'],
    dietCompatibility: ['vegan', 'vegetarian', 'omnivore', 'pescatarian'],
    allergySafe: ['dairy', 'eggs', 'shellfish'],
    defaultServings: 4,
    totalTime: 40,
    activeTime: 25,
    steps: [
      {
        instruction: 'Підсмажте цибулю, часник та спеції до аромату.',
        durationMinutes: 5,
      },
      {
        instruction: 'Додайте нут, томати та бульйон. Тушкуйте 20 хв.',
        durationMinutes: 20,
      },
      {
        instruction: 'Додайте шпинат і лимонний сік, тушкуйте ще 5 хв.',
        durationMinutes: 5,
      },
      {
        instruction: 'Подавайте з кускусом або безглютеновою кіноа.',
      },
    ],
    suggestions: [
      {
        pairing: 'Хліб',
        description: 'Подайте з лавашем із цільнозернового борошна або безглютеновим хлібом.',
      },
      {
        pairing: 'Соус',
        description: 'Додайте ложку соусу тахіні з лимоном.',
      },
    ],
    leftoverIdeas: ['Перетворіть на пасту для тостів, перебивши блендером.', 'Додайте до холодного салату з руколою.'],
    platingTips: ['Використайте глибокі піали, прикрасьте свіжою зеленню.', 'Полийте оливковою олією та додайте лимонну цедру.'],
  },
  {
    id: 'breakfast-parfait',
    title: 'Сніданковий парфе з чорницею та чіа',
    cuisine: 'Сучасна',
    baseDescription:
      'Шари кокосового йогурту, граноли, чорниці та соусу з чіа-насіння для зарядженого ранку.',
    heroImage: 'https://images.unsplash.com/photo-1472476443506-004d35d13745?auto=format&fit=crop&w=1200&q=80',
    video: {
      platform: 'youtube',
      url: 'https://www.youtube.com/embed/7R9bypkZsw0?rel=0',
    },
    difficulty: 'easy',
    tags: ['сніданок', 'швидко', 'десерт'],
    matches: ['чорниця', 'чіа', 'йогурт', 'мигдальне молоко'],
    dietCompatibility: ['vegetarian', 'pescatarian'],
    allergySafe: ['gluten'],
    defaultServings: 2,
    totalTime: 10,
    activeTime: 10,
    steps: [
      {
        instruction: 'Змішайте чіа з мигдальним молоком і залиште набухати 5 хв.',
        durationMinutes: 5,
      },
      {
        instruction: 'Збийте кокосовий йогурт з медом або сиропом агави.',
      },
      {
        instruction: 'Зберіть парфе шарами: гранола, чіа, йогурт, ягоди.',
      },
    ],
    suggestions: [
      {
        pairing: 'Додаток',
        description: 'Додайте карамелізовані яблука або мандаринові дольки.',
      },
      {
        pairing: 'Напій',
        description: 'Подайте з фільтр-кавою або холодним матча-лате.',
      },
    ],
    leftoverIdeas: ['Заморозьте у формах для морозива.', 'Зробіть нічну вівсянку, змішавши залишки з вівсяними пластівцями.'],
    platingTips: ['Подавайте у прозорих келихах для багатошарового ефекту.', 'Прикрасьте листочками м\'яти.'],
  },
]
