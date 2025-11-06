import { useCallback, useEffect, useRef, useState } from 'react';
import { VoiceCommand } from '../types';

type UseVoiceInputOptions = {
  continuous?: boolean;
  lang?: string;
};

const SpeechRecognition =
  typeof window !== 'undefined'
    ? (window.SpeechRecognition || (window as any).webkitSpeechRecognition)
    : undefined;

export const useVoiceInput = ({ continuous = false, lang = 'uk-UA' }: UseVoiceInputOptions = {}) => {
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const [isSupported, setIsSupported] = useState(Boolean(SpeechRecognition));
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [commands, setCommands] = useState<VoiceCommand[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!SpeechRecognition) return;
    recognitionRef.current = new SpeechRecognition();
    const recognition = recognitionRef.current;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;
    recognition.continuous = continuous;
    recognition.lang = lang;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcriptText = Array.from(event.results)
        .map((result) => result[0])
        .map((result) => result.transcript)
        .join(' ')
        .trim();
      setTranscript(transcriptText);
      const finalResult = event.results[event.results.length - 1];
      if (finalResult.isFinal) {
        setCommands((prev) => [
          ...prev,
          { transcript: finalResult[0].transcript.trim(), confidence: finalResult[0].confidence }
        ]);
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      setError(event.error);
      setListening(false);
    };

    recognition.onend = () => setListening(false);

    return () => {
      recognition.stop();
      recognition.onresult = null as never;
      recognition.onerror = null as never;
    };
  }, [continuous, lang]);

  const start = useCallback(() => {
    if (!recognitionRef.current) {
      setIsSupported(false);
      return;
    }
    setCommands([]);
    setTranscript('');
    setListening(true);
    setError(null);
    recognitionRef.current.start();
  }, []);

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
    setListening(false);
  }, []);

  return {
    isSupported,
    listening,
    transcript,
    commands,
    error,
    start,
    stop
  };
};
