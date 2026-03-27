import { analyzeWithGroq } from '../js/api.js';

/**
 * Med-Nav Groq Agent
 * Acts as the 'Brain' Layer, handling API communication and AI-driven analysis.
 * 
 * @param {{ raporMetni: string, kategori: string, hedefKitle: string }} payload
 */
export async function analyzeReportWithGroq(payload) {
  try {
    const result = await analyzeWithGroq(payload);
    return result;
  } catch (err) {
    if (err instanceof Error) throw err;
    throw new Error('Analiz motoru (Groq-Agent) beklenmedik bir hata ile karşılaştı.');
  }
}
