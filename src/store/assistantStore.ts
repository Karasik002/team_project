import { create } from 'zustand';
import { AssistantPrompt } from '../types';
import { nanoid } from '../utils/nanoid';

type AssistantState = {
  conversation: AssistantPrompt[];
  addUserPrompt: (content: string) => void;
  addAssistantReply: (content: string) => void;
  reset: () => void;
};

const systemPrompt: AssistantPrompt = {
  id: nanoid('prompt'),
  role: 'system',
  content:
    'Ви — голосовий кулінарний асистент. Надавайте короткі покрокові підказки, нагадуйте про техніку безпеки та таймінг.',
  createdAt: new Date().toISOString()
};

export const useAssistantStore = create<AssistantState>((set) => ({
  conversation: [systemPrompt],
  addUserPrompt: (content) =>
    set((state) => ({
      conversation: [
        ...state.conversation,
        {
          id: nanoid('prompt'),
          role: 'user',
          content,
          createdAt: new Date().toISOString()
        }
      ]
    })),
  addAssistantReply: (content) =>
    set((state) => ({
      conversation: [
        ...state.conversation,
        {
          id: nanoid('prompt'),
          role: 'assistant',
          content,
          createdAt: new Date().toISOString()
        }
      ]
    })),
  reset: () => set({ conversation: [systemPrompt] })
}));
