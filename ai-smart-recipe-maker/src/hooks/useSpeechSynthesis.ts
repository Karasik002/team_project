import { useCallback, useEffect, useState } from 'react'

type SpeechSynthesisUtteranceInit = {
  lang?: string
  pitch?: number
  rate?: number
  volume?: number
}

interface SpeechSynthesisHook {
  speak: (text: string, options?: SpeechSynthesisUtteranceInit) => void
  cancel: () => void
  speaking: boolean
  supported: boolean
}

export const useSpeechSynthesis = (): SpeechSynthesisHook => {
  const [supported, setSupported] = useState(true)
  const [speaking, setSpeaking] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      setSupported(false)
    }
  }, [])

  const speak = useCallback((text: string, options: SpeechSynthesisUtteranceInit = {}) => {
    if (!supported || typeof window === 'undefined' || !window.speechSynthesis) return

    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = options.lang ?? 'uk-UA'
    utterance.pitch = options.pitch ?? 1
    utterance.rate = options.rate ?? 1
    utterance.volume = options.volume ?? 1

    utterance.onstart = () => setSpeaking(true)
    utterance.onend = () => setSpeaking(false)
    utterance.onerror = () => setSpeaking(false)

    window.speechSynthesis.speak(utterance)
  }, [supported])

  const cancel = useCallback(() => {
    if (!supported || typeof window === 'undefined') return
    window.speechSynthesis.cancel()
    setSpeaking(false)
  }, [supported])

  return {
    speak,
    cancel,
    speaking,
    supported,
  }
}
