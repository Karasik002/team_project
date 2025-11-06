import type { FormEvent } from 'react'
import { useState } from 'react'
import { CheckCircle2, Circle, ClipboardList, Eraser, MinusCircle, PlusCircle } from 'lucide-react'
import Card from '../components/core/Card'
import Button from '../components/core/Button'
import Badge from '../components/core/Badge'
import { useShoppingListStore } from '../stores/useShoppingListStore'

const ShoppingListPage = () => {
  const { items, addItem, toggleItem, removeItem, clearCompleted } = useShoppingListStore((state) => state)
  const [name, setName] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [unit, setUnit] = useState('шт')

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!name.trim()) return

    addItem({
      name: name.trim(),
      quantity,
      unit,
      completed: false,
    })

    setName('')
    setQuantity(1)
    setUnit('шт')
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-3 rounded-3xl border border-slate-800/70 bg-slate-900/70 p-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Розумний список покупок</h1>
          <p className="text-sm text-slate-300">
            AI автоматично додає відсутні інгредієнти з рецептів. Відмічайте куплене та очищуйте виконане.
          </p>
        </div>
        <Badge variant="info">{items.filter((item) => !item.completed).length} ще потрібно</Badge>
      </header>

      <section className="grid gap-6 md:grid-cols-[1.3fr,1fr]">
        <Card className="border-slate-800/70 bg-slate-900/70">
          <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-3">
            <label className="flex flex-1 flex-col text-sm text-slate-300">
              Назва
              <input
                className="mt-1 rounded-xl border border-slate-800/70 bg-slate-900/60 px-3 py-2 text-slate-100 focus:border-brand-500 focus:outline-none"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Напр. Кокосове молоко"
                required
              />
            </label>
            <label className="flex w-24 flex-col text-sm text-slate-300">
              К-сть
              <input
                type="number"
                min={1}
                className="mt-1 rounded-xl border border-slate-800/70 bg-slate-900/60 px-3 py-2 text-slate-100 focus:border-brand-500 focus:outline-none"
                value={quantity}
                onChange={(event) => setQuantity(Number(event.target.value))}
              />
            </label>
            <label className="flex w-28 flex-col text-sm text-slate-300">
              Одиниця
              <input
                className="mt-1 rounded-xl border border-slate-800/70 bg-slate-900/60 px-3 py-2 text-slate-100 focus:border-brand-500 focus:outline-none"
                value={unit}
                onChange={(event) => setUnit(event.target.value)}
              />
            </label>
            <Button type="submit" icon={<PlusCircle className="h-4 w-4" />}>
              Додати
            </Button>
          </form>
        </Card>

        <Card className="border-slate-800/70 bg-slate-900/70">
          <h2 className="mb-3 text-sm font-semibold text-white">Швидкі дії</h2>
          <div className="flex flex-col gap-3 text-sm text-slate-300">
            <Button variant="secondary" icon={<Eraser className="h-4 w-4" />} onClick={clearCompleted} disabled={items.every((item) => !item.completed)}>
              Очистити виконане
            </Button>
            <p className="text-xs text-slate-500">
              Коли AI генерує рецепт, відсутні продукти потрапляють сюди з позначкою «AI рекомендація».
            </p>
          </div>
        </Card>
      </section>

      <section className="grid gap-4">
        {items.length === 0 ? (
          <Card className="flex flex-col items-center gap-3 border-dashed border-slate-800/70 bg-slate-900/50 py-14 text-center">
            <ClipboardList className="h-10 w-10 text-brand-400" />
            <p className="text-sm text-slate-300">Поки що список порожній — додайте інгредієнт або згенеруйте нові рецепти.</p>
          </Card>
        ) : (
          items.map((item) => (
            <Card key={item.id} className="flex flex-wrap items-center gap-4 border-slate-800/60 bg-slate-900/60 p-4">
              <button
                type="button"
                className="text-brand-300 transition hover:text-brand-200"
                onClick={() => toggleItem(item.id)}
                aria-label="Перемкнути статус"
              >
                {item.completed ? <CheckCircle2 className="h-5 w-5" /> : <Circle className="h-5 w-5" />}
              </button>
              <div className="flex min-w-[220px] flex-1 flex-col">
                <span className={`font-medium ${item.completed ? 'text-slate-500 line-through' : 'text-slate-100'}`}>
                  {item.name}
                  {item.recipeId && <span className="ml-2 text-xs text-brand-200">AI рекомендація</span>}
                </span>
                <span className="text-xs text-slate-400">
                  {item.quantity} {item.unit} · Додано {new Date(item.addedAt).toLocaleDateString()}
                </span>
              </div>
              <Button variant="ghost" size="sm" icon={<MinusCircle className="h-4 w-4" />} onClick={() => removeItem(item.id)}>
                Видалити
              </Button>
            </Card>
          ))
        )}
      </section>
    </div>
  )
}

export default ShoppingListPage
