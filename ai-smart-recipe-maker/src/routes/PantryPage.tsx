import type { FormEvent } from 'react'
import { useMemo, useState } from 'react'
import { Barcode, Boxes, CalendarClock, Check, Plus, Snowflake, ThermometerSnowflake, Trash2 } from 'lucide-react'
import Card from '../components/core/Card'
import Button from '../components/core/Button'
import Badge from '../components/core/Badge'
import { usePantryStore } from '../stores/usePantryStore'

interface FormState {
  name: string
  quantity: number
  unit: string
  category: 'produce' | 'protein' | 'dairy' | 'grains' | 'spices' | 'canned' | 'frozen' | 'other'
  storageLocation: 'pantry' | 'fridge' | 'freezer'
  expiryDate?: string
}

const initialForm: FormState = {
  name: '',
  quantity: 1,
  unit: 'шт',
  category: 'produce',
  storageLocation: 'pantry',
  expiryDate: undefined,
}

const PantryPage = () => {
  const [form, setForm] = useState<FormState>(initialForm)
  const [barcodeValue, setBarcodeValue] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const { items, addCustomItem, importByBarcode, removeItem, consumeQuantity, getExpiringSoon } = usePantryStore((state) => state)

  const groupedItems = useMemo(() => {
    return items.reduce<Record<string, typeof items>>((acc, item) => {
      const key = item.storageLocation ?? 'pantry'
      acc[key] = acc[key] ? [...acc[key], item] : [item]
      return acc
    }, {})
  }, [items])

  const expiringSoon = useMemo(() => getExpiringSoon(7), [getExpiringSoon])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!form.name.trim()) {
      setMessage('Вкажіть назву інгредієнта')
      return
    }
    addCustomItem({
      ...form,
      name: form.name.trim(),
      quantity: Number(form.quantity),
    })
    setForm(initialForm)
    setMessage('Додано до запасів')
  }

  const handleBarcodeImport = () => {
    if (!barcodeValue.trim()) return
    const added = importByBarcode(barcodeValue.trim())
    if (added) {
      setMessage(`Додано ${added.name} за штрих-кодом`)
      setBarcodeValue('')
    } else {
      setMessage('Продукт із таким штрих-кодом не знайдено у демо-базі.')
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="grid gap-4 rounded-3xl border border-slate-800/70 bg-slate-900/70 p-6 lg:grid-cols-2">
        <div>
          <h1 className="text-2xl font-semibold text-white">Мої запаси</h1>
          <p className="text-sm text-slate-300">
            Стежте за термінами придатності, додавайте продукти за штрих-кодом і отримуйте пропозиції від AI.
          </p>
        </div>
        <div className="flex flex-col gap-2 text-sm text-slate-300">
          <div className="flex items-center gap-2">
            <CalendarClock className="h-4 w-4 text-amber-300" />
            {expiringSoon.length > 0 ? (
              <span>Експресс-план: {expiringSoon.map((item) => item.name).slice(0, 3).join(', ')} потребують уваги.</span>
            ) : (
              <span>Усі продукти в нормі – чудово!</span>
            )}
          </div>
          {message && <span className="text-xs text-brand-200">{message}</span>}
        </div>
      </header>

      <section className="grid gap-6 lg:grid-cols-[1.2fr,1fr]">
        <Card className="border-slate-800/70 bg-slate-900/70">
          <h2 className="mb-4 text-sm font-semibold text-white">Додати вручну</h2>
          <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
            <label className="flex flex-col text-sm text-slate-300">
              Назва
              <input
                className="mt-1 rounded-xl border border-slate-800/70 bg-slate-900/60 px-3 py-2 text-slate-100 focus:border-brand-500 focus:outline-none"
                value={form.name}
                onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                placeholder="Напр. Авокадо"
                required
              />
            </label>
            <label className="flex flex-col text-sm text-slate-300">
              Кількість
              <input
                type="number"
                min={0}
                step={0.1}
                className="mt-1 rounded-xl border border-slate-800/70 bg-slate-900/60 px-3 py-2 text-slate-100 focus:border-brand-500 focus:outline-none"
                value={form.quantity}
                onChange={(event) => setForm((prev) => ({ ...prev, quantity: Number(event.target.value) }))}
              />
            </label>
            <label className="flex flex-col text-sm text-slate-300">
              Одиниця
              <input
                className="mt-1 rounded-xl border border-slate-800/70 bg-slate-900/60 px-3 py-2 text-slate-100 focus:border-brand-500 focus:outline-none"
                value={form.unit}
                onChange={(event) => setForm((prev) => ({ ...prev, unit: event.target.value }))}
              />
            </label>
            <label className="flex flex-col text-sm text-slate-300">
              Категорія
              <select
                className="mt-1 rounded-xl border border-slate-800/70 bg-slate-900/60 px-3 py-2 text-slate-100 focus:border-brand-500 focus:outline-none"
                value={form.category}
                onChange={(event) => setForm((prev) => ({ ...prev, category: event.target.value as FormState['category'] }))}
              >
                <option value="produce">Овочі та фрукти</option>
                <option value="protein">Білкові</option>
                <option value="dairy">Молочні / Альтернативи</option>
                <option value="grains">Зернові</option>
                <option value="spices">Спеції</option>
                <option value="canned">Консерви</option>
                <option value="frozen">Заморожені</option>
                <option value="other">Інше</option>
              </select>
            </label>
            <label className="flex flex-col text-sm text-slate-300">
              Локація зберігання
              <select
                className="mt-1 rounded-xl border border-slate-800/70 bg-slate-900/60 px-3 py-2 text-slate-100 focus:border-brand-500 focus:outline-none"
                value={form.storageLocation}
                onChange={(event) => setForm((prev) => ({ ...prev, storageLocation: event.target.value as FormState['storageLocation'] }))}
              >
                <option value="pantry">Комора</option>
                <option value="fridge">Холодильник</option>
                <option value="freezer">Морозильна камера</option>
              </select>
            </label>
            <label className="flex flex-col text-sm text-slate-300">
              Термін придатності
              <input
                type="date"
                className="mt-1 rounded-xl border border-slate-800/70 bg-slate-900/60 px-3 py-2 text-slate-100 focus:border-brand-500 focus:outline-none"
                value={form.expiryDate ?? ''}
                onChange={(event) => setForm((prev) => ({ ...prev, expiryDate: event.target.value }))}
              />
            </label>

            <div className="md:col-span-2">
              <Button type="submit" icon={<Plus className="h-4 w-4" />}>
                Додати інгредієнт
              </Button>
            </div>
          </form>
        </Card>

        <Card className="border-slate-800/70 bg-slate-900/70">
          <h2 className="mb-4 text-sm font-semibold text-white">Додати за штрих-кодом (демо)</h2>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 rounded-2xl border border-slate-800/70 bg-slate-900/60 px-3 py-2">
              <Barcode className="h-5 w-5 text-brand-300" />
              <input
                className="flex-1 bg-transparent text-sm text-slate-100 focus:outline-none"
                placeholder="Наприклад: 4820048890123"
                value={barcodeValue}
                onChange={(event) => setBarcodeValue(event.target.value)}
              />
            </div>
            <Button variant="secondary" icon={<Check className="h-4 w-4" />} onClick={handleBarcodeImport}>
              Додати з демо-каталогу
            </Button>
            <p className="text-xs text-slate-400">
              Підтримувані коди: 4820048890123 (гречка), 4820012345678 (лосось), 4820098765432 (мигдальне молоко), 4820005554321 (авокадо)
            </p>
          </div>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        {Object.entries(groupedItems).map(([location, bucket]) => (
          <Card key={location} className="border-slate-800/70 bg-slate-900/70">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-slate-300">
                {location === 'fridge' && <ThermometerSnowflake className="h-4 w-4 text-brand-300" />}
                {location === 'pantry' && <Boxes className="h-4 w-4 text-brand-300" />}
                {location === 'freezer' && <Snowflake className="h-4 w-4 text-brand-300" />}
                <span className="font-semibold text-white">
                  {location === 'fridge' ? 'Холодильник' : location === 'freezer' ? 'Морозильник' : 'Комора'}
                </span>
              </div>
              <Badge variant="info">{bucket.length}</Badge>
            </div>
            <div className="flex flex-col gap-3 text-sm text-slate-200">
              {bucket.map((item) => (
                <div key={item.id} className="rounded-2xl border border-slate-800/60 bg-slate-900/60 p-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-white">{item.name}</span>
                    <button
                      type="button"
                      className="text-slate-500 transition hover:text-rose-300"
                      onClick={() => removeItem(item.id)}
                      aria-label="Видалити"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
                    <span>
                      {item.quantity} {item.unit} · {item.category}
                    </span>
                    <span>{item.expiryDate ? new Date(item.expiryDate).toLocaleDateString() : 'без дати'}</span>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => consumeQuantity(item.id, item.quantity)}
                    >
                      Використано
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => consumeQuantity(item.id, Math.max(item.quantity / 2, 1))}
                    >
                      Використати половину
                    </Button>
                  </div>
                </div>
              ))}
              {bucket.length === 0 && <p className="text-xs text-slate-500">Немає продуктів у цій зоні.</p>}
            </div>
          </Card>
        ))}
      </section>
    </div>
  )
}

export default PantryPage
