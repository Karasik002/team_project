type BarcodeDetectorInstance = BarcodeDetector | null;

const getBarcodeDetector = async (): Promise<BarcodeDetectorInstance> => {
  if (typeof window === "undefined") return null;
  if (!((window as any).BarcodeDetector)) {
    console.warn("BarcodeDetector API недоступний у цьому браузері");
    return null;
  }

  try {
    const formats = await (window as any).BarcodeDetector.getSupportedFormats?.();
    if (!formats || !formats.length) {
      console.warn("BarcodeDetector не підтримує жодного формату");
      return null;
    }
    return new (window as any).BarcodeDetector({ formats });
  } catch (error) {
    console.error("Не вдалося ініціалізувати BarcodeDetector", error);
    return null;
  }
};

export interface DetectBarcodeResult {
  rawValue: string;
  format: string;
}

export const detectBarcodeFromImage = async (image: HTMLImageElement): Promise<DetectBarcodeResult | null> => {
  const detector = await getBarcodeDetector();
  if (!detector) return null;

  try {
    const barcodes = await detector.detect(image);
    if (!barcodes.length) return null;
    const [code] = barcodes;
    return { rawValue: code.rawValue, format: code.format };
  } catch (error) {
    console.warn("Розпізнавання штрих-коду не вдалося", error);
    return null;
  }
};

export const detectBarcodeFromVideo = async (
  video: HTMLVideoElement
): Promise<DetectBarcodeResult | null> => {
  const detector = await getBarcodeDetector();
  if (!detector) return null;

  try {
    const barcodes = await detector.detect(video);
    if (!barcodes.length) return null;
    const [code] = barcodes;
    return { rawValue: code.rawValue, format: code.format };
  } catch (error) {
    console.warn("Розпізнавання штрих-коду з відео не вдалося", error);
    return null;
  }
};
