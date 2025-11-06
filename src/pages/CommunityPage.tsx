import { FormEvent, useState } from 'react';
import { FiMessageCircle, FiSend, FiThumbsUp, FiUsers } from 'react-icons/fi';
import { nanoid } from '../utils/nanoid';

type CommunityPost = {
  id: string;
  author: string;
  title: string;
  description: string;
  likes: number;
  comments: number;
  tags: string[];
  createdAt: string;
};

const initialPosts: CommunityPost[] = [
  {
    id: nanoid('post'),
    author: 'Олег Кухар',
    title: 'Боул із нутом та кіноа',
    description: 'Поділився фірмовим соусом на основі тахіні. Ідеально під ваші веганські уподобання!',
    likes: 124,
    comments: 8,
    tags: ['веган', 'макро-баланс'],
    createdAt: new Date().toISOString()
  },
  {
    id: nanoid('post'),
    author: 'Ірина Вега',
    title: 'Zero Waste запіканка',
    description: 'Використала залишки броколі та кіноа. AI підказав додати копчену паприку — це вау!',
    likes: 86,
    comments: 5,
    tags: ['zero-waste', 'здорово'],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString()
  }
];

const CommunityPage = () => {
  const [posts, setPosts] = useState(initialPosts);
  const [form, setForm] = useState({ title: '', description: '', tags: '' });

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!form.title.trim()) return;
    const newPost: CommunityPost = {
      id: nanoid('post'),
      author: 'Марина (ви)',
      title: form.title,
      description: form.description,
      likes: 0,
      comments: 0,
      tags: form.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
      createdAt: new Date().toISOString()
    };
    setPosts((prev) => [newPost, ...prev]);
    setForm({ title: '', description: '', tags: '' });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1.4fr,1fr]">
      <section className="glass-panel rounded-3xl p-6 shadow-soft">
        <header className="mb-6 flex items-center gap-3 text-slate-100">
          <FiUsers className="text-2xl text-primary" />
          <div>
            <h2 className="text-2xl font-semibold">Спільнота AI-кухарів</h2>
            <p className="text-sm text-slate-400">Діліться рецептами, відгуками та отримуйте натхнення від інших.</p>
          </div>
        </header>
        <form className="rounded-3xl border border-slate-800/60 bg-slate-900/40 p-4" onSubmit={handleSubmit}>
          <h3 className="text-sm font-semibold text-slate-200">Опублікувати свій рецепт</h3>
          <input
            value={form.title}
            onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
            placeholder="Назва рецепту"
            className="mt-3 w-full rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-3 text-sm text-slate-100 focus:border-primary focus:outline-none"
          />
          <textarea
            value={form.description}
            onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
            placeholder="Розкажіть про особливості приготування..."
            className="mt-3 h-28 w-full resize-none rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-3 text-sm text-slate-100 focus:border-primary focus:outline-none"
          />
          <input
            value={form.tags}
            onChange={(event) => setForm((prev) => ({ ...prev, tags: event.target.value }))}
            placeholder="Теги (через кому): веган, zero-waste, швидко"
            className="mt-3 w-full rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-3 text-sm text-slate-100 focus:border-primary focus:outline-none"
          />
          <button type="submit" className="mt-4 flex items-center gap-2 rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-primary/30 transition hover:-translate-y-0.5">
            <FiSend /> Поділитися з AI-спільнотою
          </button>
        </form>

        <div className="mt-6 space-y-4">
          {posts.map((post) => (
            <article key={post.id} className="rounded-3xl border border-slate-800/60 bg-slate-900/40 p-5">
              <header className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/20 text-center text-lg leading-10 text-primary">
                  {post.author.slice(0, 1)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-100">{post.author}</p>
                  <p className="text-xs text-slate-500">{new Date(post.createdAt).toLocaleString('uk-UA')}</p>
                </div>
              </header>
              <h3 className="mt-4 text-lg font-semibold text-slate-50">{post.title}</h3>
              <p className="mt-2 text-sm text-slate-300">{post.description}</p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs text-primary">
                {post.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-primary/10 px-3 py-1">#{tag}</span>
                ))}
              </div>
              <div className="mt-4 flex items-center gap-4 text-xs text-slate-400">
                <span className="flex items-center gap-1"><FiThumbsUp /> {post.likes}</span>
                <span className="flex items-center gap-1"><FiMessageCircle /> {post.comments}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <aside className="glass-panel flex flex-col gap-5 rounded-3xl p-6 shadow-soft">
        <div className="rounded-3xl border border-slate-800/60 bg-slate-900/40 p-4 text-sm text-slate-300">
          <h3 className="text-sm font-semibold text-slate-200">Трендові страви</h3>
          <ul className="mt-3 space-y-2 text-xs text-slate-400">
            <li>🥗 Салат «Смарагдова енергія» — 782 приготування</li>
            <li>🍜 Рамен «Fusion» — 645 приготувань</li>
            <li>🍲 Суп місо з кіноа — 512 приготувань</li>
          </ul>
        </div>
        <div className="rounded-3xl border border-slate-800/60 bg-slate-900/40 p-4 text-sm text-slate-300">
          <h3 className="text-sm font-semibold text-slate-200">Кулінарні клуби</h3>
          <ul className="mt-3 space-y-2 text-xs text-slate-400">
            <li>#ZeroWasteUkr — обговорення зменшення харчових відходів.</li>
            <li>#PlantPower — рослинні рецепти від початківців до профі.</li>
            <li>#MealPrepPro — планування меню та підготовка на тиждень.</li>
          </ul>
        </div>
      </aside>
    </div>
  );
};

export default CommunityPage;
