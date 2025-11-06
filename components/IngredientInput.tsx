'use client';

import { useState, useEffect } from 'react';
import { Ingredient } from '@/types';
import { Plus, X, Mic, MicOff } from 'lucide-react';

interface Props {
  ingredients: Ingredient[];
  onIngredientsChange: (ingredients: Ingredient[]) => void;
}

export default function IngredientInput({ ingredients, onIngredientsChange }: Props) {
  const [inputValue, setInputValue] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    // Initialize Web Speech API
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.lang = 'uk-UA';

      recognitionInstance.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(transcript);
        setIsListening(false);
      };

      recognitionInstance.onerror = () => {
        setIsListening(false);
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    }
  }, []);

  const handleAddIngredient = () => {
    if (!inputValue.trim()) return;

    const newIngredient: Ingredient = {
      id: `ingredient-${Date.now()}`,
      name: inputValue.trim(),
      quantity: 1,
      unit: 'шт',
    };

    onIngredientsChange([...ingredients, newIngredient]);
    setInputValue('');
  };

  const handleRemoveIngredient = (id: string) => {
    onIngredientsChange(ingredients.filter(ing => ing.id !== id));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddIngredient();
    }
  };

  const toggleVoiceInput = () => {
    if (!recognition) {
      alert('Голосове введення не підтримується вашим браузером');
      return;
    }

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
      setIsListening(true);
    }
  };

  return (
    <div>
      {/* Input Section */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Введіть інгредієнт (наприклад: помідори, яйця, сир...)"
          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
        />
        <button
          onClick={toggleVoiceInput}
          className={`px-4 py-3 rounded-lg transition-colors ${
            isListening
              ? 'bg-red-500 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
          title="Голосове введення"
        >
          {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>
        <button
          onClick={handleAddIngredient}
          className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          <span className="hidden sm:inline">Додати</span>
        </button>
      </div>

      {isListening && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center gap-2">
          <div className="animate-pulse w-3 h-3 bg-red-500 rounded-full" />
          Слухаю... Скажіть назву інгредієнта
        </div>
      )}

      {/* Ingredients List */}
      {ingredients.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">
            Додані інгредієнти ({ingredients.length})
          </h3>
          <div className="flex flex-wrap gap-2">
            {ingredients.map((ingredient) => (
              <div
                key={ingredient.id}
                className="flex items-center gap-2 bg-orange-50 text-orange-800 px-3 py-2 rounded-full text-sm"
              >
                <span>{ingredient.name}</span>
                <button
                  onClick={() => handleRemoveIngredient(ingredient.id)}
                  className="hover:bg-orange-200 rounded-full p-1 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Add Suggestions */}
      <div className="mt-4">
        <p className="text-sm text-gray-600 mb-2">Популярні інгредієнти:</p>
        <div className="flex flex-wrap gap-2">
          {['Помідори', 'Яйця', 'Сир', 'Курка', 'Рис', 'Макарони', 'Цибуля', 'Часник'].map((item) => (
            <button
              key={item}
              onClick={() => {
                setInputValue(item);
                setTimeout(handleAddIngredient, 100);
              }}
              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
            >
              {item}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
