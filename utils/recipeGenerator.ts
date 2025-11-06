import { Recipe, Ingredient, DietaryPreference } from '@/types';

// Mock AI recipe generation - In production, this would call an actual AI API
export function generateRecipes(
  ingredients: Ingredient[],
  preferences: DietaryPreference[] = [],
  allergies: string[] = []
): Recipe[] {
  const recipes: Recipe[] = [];
  const ingredientNames = ingredients.map(i => i.name.toLowerCase());

  // Sample recipe templates
  const recipeTemplates = [
    {
      title: 'Швидкий салат із свіжих овочів',
      description: 'Легкий та поживний салат з доступних інгредієнтів',
      imageUrl: 'https://source.unsplash.com/800x600/?salad,healthy',
      prepTime: 10,
      cookTime: 0,
      difficulty: 'easy' as const,
      tags: ['салат', 'швидко', 'здорово', 'веган'],
    },
    {
      title: 'Омлет з сиром і травами',
      description: 'Пишний омлет для сніданку або швидкого перекусу',
      imageUrl: 'https://source.unsplash.com/800x600/?omelette,breakfast',
      prepTime: 5,
      cookTime: 10,
      difficulty: 'easy' as const,
      tags: ['сніданок', 'швидко', 'білки'],
    },
    {
      title: 'Паста з овочами',
      description: 'Смачна паста зі свіжими овочами у вершковому соусі',
      imageUrl: 'https://source.unsplash.com/800x600/?pasta,vegetables',
      prepTime: 15,
      cookTime: 20,
      difficulty: 'medium' as const,
      tags: ['паста', 'обід', 'вегетаріанське'],
    },
    {
      title: 'Курка з овочами в духовці',
      description: 'Соковита курка з карамелізованими овочами',
      imageUrl: 'https://source.unsplash.com/800x600/?chicken,roasted',
      prepTime: 20,
      cookTime: 45,
      difficulty: 'medium' as const,
      tags: ['курка', 'духовка', 'обід', 'вечеря'],
    },
    {
      title: 'Смузі боул з фруктами',
      description: 'Енергетичний смузі боул з свіжими фруктами та горіхами',
      imageUrl: 'https://source.unsplash.com/800x600/?smoothie,bowl',
      prepTime: 10,
      cookTime: 0,
      difficulty: 'easy' as const,
      tags: ['сніданок', 'здорово', 'веган', 'швидко'],
    },
  ];

  recipeTemplates.forEach((template, index) => {
    // Filter based on dietary preferences
    const isVegan = preferences.includes('vegan');
    const isVegetarian = preferences.includes('vegetarian');
    const isKeto = preferences.includes('keto');

    if (isVegan && !template.tags.includes('веган')) return;
    if (isVegetarian && template.tags.includes('курка')) return;
    if (isKeto && template.tags.includes('паста')) return;

    const recipe: Recipe = {
      id: `recipe-${index + 1}`,
      ...template,
      videoUrl: `https://example.com/video/${index + 1}`,
      servings: 2,
      ingredients: generateIngredients(ingredientNames),
      steps: generateSteps(template.title),
      calories: Math.floor(Math.random() * 400) + 200,
      protein: Math.floor(Math.random() * 30) + 10,
      carbs: Math.floor(Math.random() * 50) + 20,
      fat: Math.floor(Math.random() * 20) + 5,
      author: 'AI Chef',
      rating: Math.random() * 2 + 3,
      reviews: [],
      createdAt: new Date(),
    };

    recipes.push(recipe);
  });

  return recipes.slice(0, 6);
}

function generateIngredients(availableIngredients: string[]) {
  const commonIngredients = [
    { name: 'Олія оливкова', quantity: 2, unit: 'ст.л.' },
    { name: 'Сіль', quantity: 1, unit: 'за смаком' },
    { name: 'Перець', quantity: 1, unit: 'за смаком' },
  ];

  return [
    ...availableIngredients.slice(0, 3).map(name => ({
      name,
      quantity: Math.floor(Math.random() * 300) + 100,
      unit: 'г',
    })),
    ...commonIngredients,
  ];
}

function generateSteps(recipeTitle: string): string[] {
  return [
    'Підготуйте всі необхідні інгредієнти та посуд',
    'Помийте та очистіть овочі за потреби',
    'Наріжте інгредієнти відповідно до рецепту',
    'Розігрійте сковороду або духовку до потрібної температури',
    'Приготуйте страву згідно з інструкціями',
    'Додайте спеції та приправи за смаком',
    'Подавайте гарячим, прикрасивши свіжою зеленню',
  ];
}

export function calculateNutrition(ingredients: Ingredient[]): {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
} {
  // Mock calculation - in production would use nutrition database
  return {
    calories: Math.floor(Math.random() * 400) + 300,
    protein: Math.floor(Math.random() * 30) + 15,
    carbs: Math.floor(Math.random() * 50) + 25,
    fat: Math.floor(Math.random() * 20) + 10,
  };
}
