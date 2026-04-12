import { analyzeWithGeminiVision } from '../js/api.js';

/**
 * Med-Nav Vision Agent
 * Acts as the 'Vision Brain' Layer, handling Gemini Vision API communication
 * for image and PDF-based medical report analysis.
 * 
 * @param {{ files: Array, raporMetni: string, kategori: string, hedefKitle: string }} payload
 */
export async function analyzeImageWithGemini(payload) {
  try {
    const result = await analyzeWithGeminiVision(payload);
    return result;
  } catch (err) {
    if (err instanceof Error) throw err;
    throw new Error('Görsel analiz motoru (Gemini-Vision-Agent) beklenmedik bir hata ile karşılaştı.');
  }
}
