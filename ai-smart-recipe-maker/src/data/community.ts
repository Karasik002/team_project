import type { CommunityPost } from '../types'

export const communityFeed: CommunityPost[] = [
  {
    id: 'community-001',
    author: {
      name: 'Олег Шевченко',
      avatar: 'https://images.unsplash.com/photo-1531891437562-4301cf35b7e4?auto=format&fit=crop&w=120&q=80',
    },
    title: 'AI підказав – я приготував!',
    description: 'Поділився сьогодні цитрусовим лососем. Смак неймовірний, а поради щодо подачі зекономили купу часу.',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80',
    recipeId: 'citrus-salmon-bowl',
    likes: 128,
    tags: ['вечеря', 'омега-3', 'zero-waste'],
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    comments: [
      {
        id: 'comment-001',
        author: {
          name: 'Анжеліка Коваль',
          avatar: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=120&q=80',
        },
        message: 'Виглядає фантастично! Я додала трішки лайму – рекомендую!',
        createdAt: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
      },
    ],
  },
  {
    id: 'community-002',
    author: {
      name: 'Катерина Мельник',
      avatar: 'https://images.unsplash.com/photo-1521579971123-1192931a1452?auto=format&fit=crop&w=120&q=80',
    },
    title: 'Веганський боул тижня',
    description: 'AI згенерував рецепт із залишків овочів. Додала трохи манго для свіжості.',
    image: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1200&q=80',
    recipeId: 'vegan-umami-bowl',
    likes: 205,
    tags: ['веган', 'гарнір', 'leftovers'],
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    comments: [
      {
        id: 'comment-010',
        author: {
          name: 'Марко Іванов',
          avatar: 'https://images.unsplash.com/photo-1530268729831-4b0b9e170218?auto=format&fit=crop&w=120&q=80',
        },
        message: 'Дякую за ідею з манго, дуже освіжає!',
        createdAt: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString(),
      },
    ],
  },
]
