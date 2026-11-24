import { createWorker } from 'tesseract.js';

export interface OcrResult {
  text: string;
  confidence: number;
  isLikelyHandwritten: boolean;
  lines: Array<{
    text: string;
    confidence: number;
  }>;
}

export type OcrProgressCallback = (progress: number, status: string) => void;

/**
 * Runs client-side OCR on an image file or Data URL using Tesseract.js
 */
export async function extractTextFromImage(
  imageSource: File | Blob | string,
  onProgress?: OcrProgressCallback
): Promise<OcrResult> {
  let worker: any = null;
  try {
    worker = await createWorker('eng', 1, {
      logger: (m: any) => {
        if (m.status === 'recognizing text' && onProgress) {
          onProgress(Math.round(m.progress * 100), 'Recognizing text...');
        } else if (onProgress && m.status) {
          onProgress(10, m.status);
        }
      },
    });

    const ret = await worker.recognize(imageSource);
    const text = ret.data.text || '';
    const confidence = (ret.data.confidence || 0) / 100;

    // Detect if handwriting or low-quality scan
    // Lower average confidence or high character entropy often indicates cursive doctor handwriting
    const isLikelyHandwritten = confidence < 0.75 || /unreadable|illegible|[\u0000-\u001F]/i.test(text);

    const lines = (ret.data.lines || []).map((line: any) => ({
      text: line.text.trim(),
      confidence: (line.confidence || 0) / 100,
    })).filter((l: any) => l.text.length > 0);

    return {
      text,
      confidence,
      isLikelyHandwritten,
      lines,
    };
  } catch (error) {
    console.error('OCR Extraction error:', error);
    // Graceful fallback if OCR worker fails
    return {
      text: '',
      confidence: 0,
      isLikelyHandwritten: true,
      lines: [],
    };
  } finally {
    if (worker) {
      try {
        await worker.terminate();
      } catch (e) {
        // ignore worker termination error
      }
    }
  }
}
