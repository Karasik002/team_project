import { useCallback, useEffect, useRef, useState } from "react";

import { VoiceStatus } from "../types";

type Recognition = SpeechRecognition | null;

const getSpeechRecognition = (): Recognition => {
  if (typeof window === "undefined") return null;
  const SpeechRecognitionAPI =
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  if (!SpeechRecognitionAPI) return null;
  const recognition = new SpeechRecognitionAPI();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = "uk-UA";
  return recognition;
};

export const useSpeechRecognition = () => {
  const recognitionRef = useRef<Recognition>(null);
  const [status, setStatus] = useState<VoiceStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    recognitionRef.current = getSpeechRecognition();
    setIsSupported(!!recognitionRef.current);
  }, []);

  const listen = useCallback(() => {
    if (!recognitionRef.current) {
      setError("Цей браузер не підтримує розпізнавання мовлення");
      return;
    }

    setStatus("listening");
    setError(null);

    recognitionRef.current.start();
  }, []);

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
    setStatus("idle");
  }, []);

  const subscribe = useCallback(
    (onResult: (transcript: string) => void) => {
      const recognition = recognitionRef.current;
      if (!recognition) return () => undefined;

      const handleResult = (event: SpeechRecognitionEvent) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0].transcript)
          .join(" ");
        onResult(transcript.trim());
        setStatus("idle");
      };

      const handleError = (event: SpeechRecognitionErrorEvent) => {
        setError(event.error);
        setStatus("error");
      };

      const handleEnd = () => {
        setStatus((current) => (current === "listening" ? "idle" : current));
      };

      recognition.addEventListener("result", handleResult);
      recognition.addEventListener("error", handleError);
      recognition.addEventListener("end", handleEnd);

      return () => {
        recognition.removeEventListener("result", handleResult);
        recognition.removeEventListener("error", handleError);
        recognition.removeEventListener("end", handleEnd);
      };
    },
    []
  );

  return { status, error, listen, stop, subscribe, isSupported };
};
