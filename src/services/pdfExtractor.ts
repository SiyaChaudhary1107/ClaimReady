import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || '3.11.174'}/pdf.worker.min.js`;
}

export interface ExtractedPdfPage {
  pageNumber: number;
  text: string;
}

export interface ExtractedPdfResult {
  totalPages: number;
  pages: ExtractedPdfPage[];
  fullText: string;
}

/**
 * Extracts raw text from an ArrayBuffer or File using PDF.js
 */
export async function extractTextFromPdf(fileOrBuffer: File | ArrayBuffer): Promise<ExtractedPdfResult> {
  let arrayBuffer: ArrayBuffer;

  if (fileOrBuffer instanceof File) {
    arrayBuffer = await fileOrBuffer.arrayBuffer();
  } else {
    arrayBuffer = fileOrBuffer;
  }

  const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) });
  const pdfDoc = await loadingTask.promise;
  const totalPages = pdfDoc.numPages;
  const pages: ExtractedPdfPage[] = [];
  const fullTextParts: string[] = [];

  for (let i = 1; i <= totalPages; i++) {
    const page = await pdfDoc.getPage(i);
    const textContent = await page.getTextContent();
    
    // Combine text items with appropriate spacing
    const pageStrings: string[] = [];
    let lastY: number | null = null;

    for (const item of textContent.items) {
      if ('str' in item) {
        const textItem = item as { str: string; transform: number[] };
        const currentY = textItem.transform[5];
        
        if (lastY !== null && Math.abs(currentY - lastY) > 5) {
          pageStrings.push('\n');
        } else if (pageStrings.length > 0 && !pageStrings[pageStrings.length - 1].endsWith(' ')) {
          pageStrings.push(' ');
        }
        
        pageStrings.push(textItem.str);
        lastY = currentY;
      }
    }

    const pageText = pageStrings.join('').trim();
    pages.push({
      pageNumber: i,
      text: pageText,
    });
    fullTextParts.push(`--- Page ${i} ---\n${pageText}`);
  }

  return {
    totalPages,
    pages,
    fullText: fullTextParts.join('\n\n'),
  };
}
