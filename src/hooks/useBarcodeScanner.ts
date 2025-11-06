import { useCallback, useEffect, useRef, useState } from 'react';

type BarcodeResult = {
  rawValue: string;
  format: string;
};

type UseBarcodeScannerOptions = {
  videoConstraints?: MediaStreamConstraints['video'];
};

const hasBarcodeDetector = () => typeof window !== 'undefined' && 'BarcodeDetector' in window;

export const useBarcodeScanner = ({
  videoConstraints = { facingMode: 'environment' }
}: UseBarcodeScannerOptions = {}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isSupported] = useState(hasBarcodeDetector());
  const [detected, setDetected] = useState<BarcodeResult | null>(null);
  const [active, setActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
  }, []);

  const start = useCallback(async () => {
    if (!isSupported) {
      setError('Сканування штрих-кодів не підтримується цим браузером.');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: videoConstraints });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      const detector = new (window as any).BarcodeDetector({ formats: ['ean_13', 'ean_8', 'code_128'] });
      setActive(true);
      const scan = async () => {
        if (!videoRef.current || !active) return;
        const results: BarcodeResult[] = await detector.detect(videoRef.current);
        if (results.length) {
          setDetected(results[0]);
          setActive(false);
          streamRef.current?.getTracks().forEach((track) => track.stop());
        } else {
          requestAnimationFrame(scan);
        }
      };
      requestAnimationFrame(scan);
    } catch (err) {
      console.error(err);
      setError('Не вдалося отримати доступ до камери.');
    }
  }, [active, isSupported, videoConstraints]);

  const stop = useCallback(() => {
    setActive(false);
    streamRef.current?.getTracks().forEach((track) => track.stop());
  }, []);

  return {
    videoRef,
    isSupported,
    detected,
    start,
    stop,
    error,
    active
  };
};
