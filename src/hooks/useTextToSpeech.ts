import { useCallback, useEffect, useRef, useState } from "react";

import { VoiceStatus } from "../types";

export const useTextToSpeech = () => {
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const [status, setStatus] = useState<VoiceStatus>("idle");
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    synthRef.current = window.speechSynthesis;

    const populateVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices.filter((voice) => voice.lang.startsWith("uk") || voice.lang.startsWith("en")));
    };

    populateVoices();
    window.speechSynthesis.addEventListener("voiceschanged", populateVoices);

    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", populateVoices);
    };
  }, []);

  const speak = useCallback((text: string, pitch = 1) => {
    if (!synthRef.current) return;
    if (synthRef.current.speaking) {
      synthRef.current.cancel();
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.pitch = pitch;
    utterance.rate = 1;
    utterance.volume = 1;

    const preferredVoice = voices.find((voice) => voice.lang.startsWith("uk"));
    if (preferredVoice) utterance.voice = preferredVoice;

    utterance.onstart = () => setStatus("speaking");
    utterance.onend = () => setStatus("idle");
    utterance.onerror = () => setStatus("error");

    synthRef.current.speak(utterance);
  }, [voices]);

  const stop = useCallback(() => {
    if (!synthRef.current) return;
    synthRef.current.cancel();
    setStatus("idle");
  }, []);

  return { status, speak, stop, voices, isSupported: Boolean(typeof window !== "undefined" && window.speechSynthesis) };
};
