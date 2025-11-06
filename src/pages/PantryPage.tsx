import { FormEvent, useEffect, useMemo, useState } from 'react';
import { FiAlertTriangle, FiCamera, FiCheckCircle, FiClock, FiShoppingCart } from 'react-icons/fi';
import { usePantryStore } from '../store/pantryStore';
import { formatRelative } from '../utils/time';
import { useBarcodeScanner } from '../hooks/useBarcodeScanner';

const units = ['шт', 'г', 'кг', 'мл', 'л', 'порція'] as const;
const categories = ['овочі', 'фрукти', 'мясо', 'риба', 'бакалія', 'молочні', 'спеції', 'заморожені', 'інші'] as const;

type FormState = {
  name: string;
  quantity: number;
  unit: typeof units[number];
  category: typeof categories[number];
  storage: 'холодильник' | 'морозильник' | 'кімнатна температура';
  expiresAt: string;
};

const PantryPage = () => {
  const { items, shoppingList, alerts, addItem, addItemFromBarcode, consumeItem, toggleShoppingItem } = usePantryStore();
  const scanner = useBarcodeScanner({});

  const [form, setForm] = useState<FormState>({
    name: '',
    quantity: 1,
    unit: units[0],
    category: categories[0],
    storage: 'холодильник',
    expiresAt: new Date().toISOString().slice(0, 10)
  });

  useEffect(() => {
    if (!scanner.detected) return;
    addItemFromBarcode('Новий продукт', scanner.detected.rawValue);
  }, [scanner.detected, addItemFromBarcode]);

  const nearExpiry = useMemo(() => alerts.slice(0, 3), [alerts]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!form.name.trim()) return;
    addItem({
      name: form.name,
      quantity: Number(form.quantity),
      unit: form.unit,
      category: form.category,
      storage: form.storage,
      expiresAt: new Date(form.expiresAt).toISOString()
    });
    setForm({ ...form, name: '' });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1.6fr,1fr]">
      <section className="glass-panel rounded-3xl p-6 shadow-soft">
        <header className="mb-6 flex flex-wrap items-center gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-slate-50">Розумна комора</h2>
            <p className="text-sm text-slate-400">AI відстежує запаси, терміни придатності та пропонує, що купити.</p>
          </div>
          <button
            type="button"
            onClick={scanner.active ? scanner.stop : scanner.start}
            className={`ml-auto flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition ${
              scanner.active ? 'border-emerald-400 bg-emerald-500/20 text-emerald-200' : 'border-primary/40 text-primary hover:bg-primary/10'
            }`}
          >
            <FiCamera /> {scanner.active ? 'Зупинити сканування' : scanner.isSupported ? 'Сканувати штрих-код' : 'Сканер недоступний'}
          </button>
        </header>
        {scanner.error && <p className="mb-4 rounded-2xl bg-rose-500/10 p-3 text-xs text-rose-300">{scanner.error}</p>}
        <form className="grid gap-3 md:grid-cols-4" onSubmit={handleSubmit}>
          <input
            value={form.name}
            onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
            placeholder="Назва продукту"
            className="rounded-2xl border border-slate-700 bg-slate-900/60 px-4 py-3 text-sm text-slate-100 focus:border-primary focus:outline-none md:col-span-2"
          />
          <input
            type="number"
            min={0}
            value={form.quantity}
            onChange={(event) => setForm((prev) => ({ ...prev, quantity: Number(event.target.value) }))}
            className="rounded-2xl border border-slate-700 bg-slate-900/60 px-4 py-3 text-sm text-slate-100 focus:border-primary focus:outline-none"
          />
          <select
            value={form.unit}
            onChange={(event) => setForm((prev) => ({ ...prev, unit: event.target.value as typeof units[number] }))}
            className="rounded-2xl border border-slate-700 bg-slate-900/60 px-4 py-3 text-sm text-slate-100 focus:border-primary focus:outline-none"
          >
            {units.map((unit) => (
              <option key={unit} value={unit}>{unit}</option>
            ))}
          </select>
          <select
            value={form.category}
            onChange={(event) => setForm((prev) => ({ ...prev, category: event.target.value as typeof categories[number] }))}
            className="rounded-2xl border border-slate-700 bg-slate-900/60 px-4 py-3 text-sm text-slate-100 focus:border-primary focus:outline-none md:col-span-2"
          >
            {categories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <select
            value={form.storage}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, storage: event.target.value as FormState['storage'] }))
            }
            className="rounded-2xl border border-slate-700 bg-slate-900/60 px-4 py-3 text-sm text-slate-100 focus:border-primary focus:outline-none"
          >
            <option value="холодильник">холодильник</option>
            <option value="морозильник">морозильник</option>
            <option value="кімнатна температура">кімнатна температура</option>
          </select>
          <input
            type="date"
            value={form.expiresAt}
            onChange={(event) => setForm((prev) => ({ ...prev, expiresAt: event.target.value }))}
            className="rounded-2xl border border-slate-700 bg-slate-900/60 px-4 py-3 text-sm text-slate-100 focus:border-primary focus:outline-none"
          />
          <button
            type="submit"
            className="rounded-2xl bg-primary px-4 py-3 text-sm font-medium text-slate-950 shadow-lg shadow-primary/30 transition hover:-translate-y-0.5"
          >
            Додати продукт
          </button>
        </form>
        <div className="mt-6 grid gap-3">
          {items.map((item) => (
            <div key={item.id} className="flex flex-wrap items-center gap-4 rounded-2xl border border-slate-800/50 bg-slate-900/40 p-4 text-sm">
              <div>
                <p className="text-sm font-semibold text-slate-50">{item.name}</p>
                <p className="text-xs text-slate-400">{item.quantity} {item.unit} • {item.category}</p>
              </div>
              <div className="ml-auto flex flex-wrap items-center gap-3 text-xs text-slate-400">
                <span className="flex items-center gap-1"><FiClock /> {formatRelative(item.expiresAt)}</span>
                <span className="rounded-full bg-slate-800/60 px-3 py-1 text-[11px]">{item.storage}</span>
                <button
                  type="button"
                  onClick={() => consumeItem(item.id, 1)}
                  className="flex items-center gap-1 rounded-full bg-emerald-500/15 px-3 py-1 text-[11px] text-emerald-200 hover:bg-emerald-500/25"
                >
                  <FiCheckCircle /> Використано
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <aside className="glass-panel flex flex-col gap-5 rounded-3xl p-6 shadow-soft">
        <div>
          <h3 className="text-lg font-semibold text-slate-50">Алерти свіжості</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {nearExpiry.map((alert) => (
              <li key={alert.itemId} className="flex items-center gap-3 rounded-2xl bg-amber-500/10 p-3 text-amber-100">
                <FiAlertTriangle />
                <div>
                  <p>{alert.name}</p>
                  <p className="text-xs text-amber-200">закінчується {alert.expiresInDays === 0 ? 'сьогодні' : `через ${alert.expiresInDays} дн.`}</p>
                </div>
              </li>
            ))}
            {nearExpiry.length === 0 && <p className="text-xs text-slate-500">Все свіжо, можна експериментувати!</p>}
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-slate-50">Список покупок</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {shoppingList.map((item) => (
              <li key={item.id} className={`flex items-center gap-3 rounded-2xl border border-slate-800/50 p-3 ${item.checked ? 'bg-emerald-500/10 text-emerald-200' : 'bg-slate-900/40 text-slate-300'}`}>
                <button
                  type="button"
                  onClick={() => toggleShoppingItem(item.id)}
                  className={`flex h-5 w-5 items-center justify-center rounded-full border ${item.checked ? 'border-emerald-400 bg-emerald-500/40' : 'border-slate-600'}`}
                >
                  {item.checked && <FiCheckCircle className="text-[12px]" />}
                </button>
                <div className="flex-1">
                  <p className="text-sm font-medium">{item.ingredient}</p>
                  <p className="text-[11px] text-slate-400">{item.quantity} • {item.reason}</p>
                </div>
                <FiShoppingCart className="text-slate-600" />
              </li>
            ))}
            {shoppingList.length === 0 && <p className="text-xs text-slate-500">Список пустий. AI додасть інгредієнти автоматично, якщо чогось бракуватиме.</p>}
          </ul>
        </div>

        {scanner.active && (
          <div className="rounded-3xl border border-slate-800/70 bg-slate-900/40 p-4">
            <p className="text-xs uppercase tracking-widest text-slate-500">Превʼю камери</p>
            <video ref={scanner.videoRef} className="mt-3 w-full rounded-2xl bg-black/60" muted playsInline />
          </div>
        )}
      </aside>
    </div>
  );
};

export default PantryPage;
