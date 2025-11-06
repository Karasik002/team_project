import { FormEvent, useEffect, useMemo, useState } from 'react';
import { FiHeadphones, FiMic, FiRefreshCcw, FiSend } from 'react-icons/fi';
import { useAssistantStore } from '../store/assistantStore';
import { useVoiceInput } from '../hooks/useVoiceInput';

const quickPrompts = [
  'Який наступний крок?',
  'Скільки часу смажити тофу?',
  'Чим замінити арахіс?',
  'Як подати страву ефектно?'
];

const generateAssistantReply = (message: string): string => {
  const lower = message.toLowerCase();
  if (lower.includes('крок')) {
    return 'Наступний крок: додайте соус та готуйте 2 хвилини, постійно помішуючи. Не забувайте про середній вогонь.';
  }
  if (lower.includes('час')) {
    return 'Для оптимальної текстури обсмажуйте тофу 4 хвилини з кожного боку, доки він не стане золотистим.';
  }
  if (lower.includes('замін')) {
    return 'Можна замінити арахіс на мигдальні пластівці або насіння соняшника для хрусткої текстури без алергенів.';
  }
  if (lower.includes('подати')) {
    return 'Подавайте в глибокій тарілці, додайте краплі соусу вздовж борту та посипте мікрозеленню для ресторанного вигляду.';
  }
  return 'Продовжуйте готувати на середньому вогні ще 3 хвилини та перевірте смак. Додайте щіпку солі або лимонного соку за потреби.';
};

const AssistantPage = () => {
  const { conversation, addAssistantReply, addUserPrompt, reset } = useAssistantStore();
  const voice = useVoiceInput({ continuous: false });
  const [input, setInput] = useState('');

  useEffect(() => {
    if (!voice.commands.length) return;
    const latest = voice.commands[voice.commands.length - 1];
    if (!latest) return;
    submitMessage(latest.transcript);
  }, [voice.commands]);

  const submitMessage = (message: string) => {
    if (!message.trim()) return;
    addUserPrompt(message);
    const reply = generateAssistantReply(message);
    setTimeout(() => addAssistantReply(reply), 300);
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    submitMessage(input);
    setInput('');
  };

  const reversedConversation = useMemo(() => [...conversation].reverse(), [conversation]);

  return (
    <div className="grid gap-6 lg:grid-cols-[1.4fr,1fr]">
      <section className="glass-panel flex flex-col rounded-3xl p-6 shadow-soft">
        <header className="mb-6 flex flex-wrap items-center gap-4 text-slate-100">
          <FiHeadphones className="text-2xl text-primary" />
          <div>
            <h2 className="text-2xl font-semibold">Асистент на кухні</h2>
            <p className="text-sm text-slate-400">Голосові підказки в режимі реального часу під час приготування.</p>
          </div>
          <div className="ml-auto flex gap-2">
            <button
              type="button"
              onClick={voice.listening ? voice.stop : voice.start}
              className={`flex items-center gap-2 rounded-full border px-4 py-2 text-xs transition ${
                voice.listening ? 'border-emerald-400 bg-emerald-500/20 text-emerald-200' : 'border-primary/40 text-primary hover:bg-primary/10'
              }`}
            >
              <FiMic /> {voice.listening ? 'Завершити запис' : voice.isSupported ? 'Сказати голосом' : 'Голос недоступний'}
            </button>
            <button
              type="button"
              onClick={reset}
              className="flex items-center gap-2 rounded-full border border-slate-600 px-4 py-2 text-xs text-slate-400 hover:border-rose-400 hover:text-rose-300"
            >
              <FiRefreshCcw /> Очистити діалог
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-hidden rounded-3xl border border-slate-800/60 bg-slate-900/40">
          <div className="max-h-[420px] space-y-3 overflow-y-auto p-4">
            {reversedConversation.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'assistant' ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-md rounded-2xl px-4 py-3 text-sm ${
                    message.role === 'assistant'
                      ? 'bg-slate-800/80 text-slate-100'
                      : 'bg-primary text-slate-950'
                  }`}
                >
                  <p>{message.content}</p>
                  <p className="mt-2 text-[10px] uppercase tracking-widest text-slate-400">
                    {new Date(message.createdAt).toLocaleTimeString('uk-UA')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <form className="mt-4 flex flex-col gap-3" onSubmit={handleSubmit}>
          <div className="flex gap-2">
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Задайте питання: \"Що далі?\""
              className="flex-1 rounded-2xl border border-slate-700 bg-slate-900/60 px-4 py-3 text-sm text-slate-100 focus:border-primary focus:outline-none"
            />
            <button type="submit" className="flex items-center gap-2 rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-primary/30">
              <FiSend /> Надіслати
            </button>
          </div>
          {voice.transcript && (
            <p className="text-xs text-slate-500">Ви сказали: {voice.transcript}</p>
          )}
        </form>
      </section>

      <aside className="glass-panel flex flex-col gap-5 rounded-3xl p-6 shadow-soft">
        <div className="rounded-3xl border border-slate-800/60 bg-slate-900/40 p-4 text-sm text-slate-300">
          <h3 className="text-sm font-semibold text-slate-200">Швидкі команди</h3>
          <div className="mt-3 grid gap-2">
            {quickPrompts.map((prompt) => (
              <button
                type="button"
                key={prompt}
                onClick={() => submitMessage(prompt)}
                className="rounded-2xl border border-slate-700 px-4 py-2 text-left text-xs text-slate-300 transition hover:border-primary hover:text-primary"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
        <div className="rounded-3xl border border-slate-800/60 bg-slate-900/40 p-4 text-sm text-slate-300">
          <h3 className="text-sm font-semibold text-slate-200">Порада дня</h3>
          <p className="mt-2 text-xs text-slate-400">
            Тримайте поруч таймер або використовуйте голосову команду: «Нагадай через 3 хвилини», щоб AI повідомив про наступний крок.
          </p>
        </div>
      </aside>
    </div>
  );
};

export default AssistantPage;
