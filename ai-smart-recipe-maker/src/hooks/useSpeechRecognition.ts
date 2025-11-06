import { useCallback, useEffect, useRef, useState } from 'react'

type RecognitionResult = {
  results: {
    length: number
    [index: number]: {
      0: {
        transcript: string
      }
    }
  }
}

type RecognitionError = { error: string }

interface RecognitionInstance {
  lang: string
  continuous: boolean
  interimResults: boolean
  maxAlternatives: number
  onresult: ((event: RecognitionResult) => void) | null
  onerror: ((event: RecognitionError) => void) | null
  onend: (() => void) | null
  start: () => void
  stop: () => void
}

type RecognitionConstructor = new () => RecognitionInstance

declare global {
  interface Window {
    SpeechRecognition?: RecognitionConstructor
    webkitSpeechRecognition?: RecognitionConstructor
  }
}

type Recognition = RecognitionInstance | null

interface SpeechRecognitionHook {
  transcript: string
  isListening: boolean
  isSupported: boolean
  error: string | null
  startListening: (language?: string) => void
  stopListening: () => void
  resetTranscript: () => void
}

const getRecognition = (): Recognition => {
  if (typeof window === 'undefined') return null

  const SpeechRecognitionApi = window.SpeechRecognition || window.webkitSpeechRecognition

  if (!SpeechRecognitionApi) return null

  const recognition: RecognitionInstance = new SpeechRecognitionApi()
  recognition.continuous = false
  recognition.interimResults = true
  recognition.maxAlternatives = 1

  return recognition
}

export const useSpeechRecognition = (): SpeechRecognitionHook => {
  const recognitionRef = useRef<Recognition>(null)
  const [transcript, setTranscript] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSupported, setIsSupported] = useState(true)

  useEffect(() => {
    recognitionRef.current = getRecognition()
    setIsSupported(Boolean(recognitionRef.current))

    return () => {
      recognitionRef.current?.stop()
    }
  }, [])

  const startListening = useCallback((language = 'uk-UA') => {
    const recognition = recognitionRef.current
    if (!recognition) {
      setError('Голосовий ввід не підтримується у вашому браузері.')
      return
    }

    recognition.lang = language
    recognition.onresult = (event) => {
      const lastIndex = event.results.length - 1
      const lastResult = lastIndex >= 0 ? event.results[lastIndex] : undefined
      const transcript = lastResult?.[0]?.transcript
      if (transcript) {
        setTranscript(transcript)
      }
    }

    recognition.onerror = (event) => {
      setError(event.error)
      setIsListening(false)
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    setTranscript('')
    setError(null)
    setIsListening(true)
    recognition.start()
  }, [])

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop()
    setIsListening(false)
  }, [])

  const resetTranscript = useCallback(() => {
    setTranscript('')
    setError(null)
  }, [])

  return {
    transcript,
    isListening,
    isSupported,
    error,
    startListening,
    stopListening,
    resetTranscript,
  }
}
