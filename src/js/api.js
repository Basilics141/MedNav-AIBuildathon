import { buildSystemPrompt, buildUserPrompt, CLAUDE_MODEL, buildGeminiSystemPrompt } from './prompts.js';
import { parseClaudeAnalysis } from './parse.js';

const ANTHROPIC_MESSAGES_URL = 'https://api.anthropic.com/v1/messages';

/**
 * Claude Messages API — tarayıcıdan doğrudan çağrı (tech-stack header kuralı).
 * @param {{ raporMetni: string, kategori: string, hedefKitle: string }} payload
 */
export async function analyzeReport({ raporMetni, kategori, hedefKitle }) {
  const apiKey = import.meta.env.VITE_CLAUDE_API_KEY;
  if (!apiKey || !String(apiKey).trim()) {
    throw new Error(
      'API anahtarı bulunamadı. Proje kökünde .env dosyası oluşturup VITE_CLAUDE_API_KEY değerini girin; ardından sunucuyu yeniden başlatın.',
    );
  }

  const system = buildSystemPrompt({ kategori, hedefKitle });
  const userContent = buildUserPrompt({ raporMetni, kategori });

  const body = {
    model: CLAUDE_MODEL,
    max_tokens: 4096,
    system,
    messages: [{ role: 'user', content: userContent }],
  };

  let res;
  try {
    res = await fetch(ANTHROPIC_MESSAGES_URL, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': String(apiKey).trim(),
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify(body),
    });
  } catch {
    throw new Error('Ağ hatası: İnternet bağlantınızı kontrol edip yeniden deneyin.');
  }

  if (!res.ok) {
    let detail = '';
    try {
      const errJson = await res.json();
      detail = errJson.error?.message || JSON.stringify(errJson);
    } catch {
      detail = await res.text();
    }
    throw new Error(
      `API yanıtı başarısız (${res.status}). ${detail || 'Bilinmeyen hata.'}`,
    );
  }

  let data;
  try {
    data = await res.json();
  } catch {
    throw new Error('API yanıtı okunamadı.');
  }

  const text = data.content?.[0]?.text;
  if (!text || !String(text).trim()) {
    throw new Error('Model metin üretmedi. Lütfen yeniden deneyin.');
  }

  return parseClaudeAnalysis(text, kategori);
}

/**
 * Gemini 1.5 Flash API — Direct REST fetch.
 */
export async function analyzeWithGemini({ raporMetni, kategori, hedefKitle, apiKey }) {
  if (!apiKey || apiKey === 'BURAYA_API_KEY_GELECEK') {
    throw new Error('Lütfen Gemini API anahtarınızı app.js dosyasındaki ilgili yere ekleyin.');
  }

  const systemPrompt = buildGeminiSystemPrompt({ kategori, hedefKitle });
  const userContent = `Aşağıdaki ${kategori} raporunu analiz et:\n\n${raporMetni}`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const body = {
    contents: [
      {
        parts: [
          {
            text: `${systemPrompt}\n\nUSER DATA:\n${userContent}`
          }
        ]
      }
    ],
    generationConfig: {
      temperature: 0.1,
      topP: 0.95,
      topK: 64,
      maxOutputTokens: 2048,
      responseMimeType: "application/json",
    }
  };

  let res;
  try {
    res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });
  } catch (err) {
    throw new Error('Ağ hatası: Gemini API sunucusuna erişilemedi.');
  }

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    const msg = errData.error?.message || 'Bilinmeyen Gemini API hatası.';
    throw new Error(`Gemini API Hatası (${res.status}): ${msg}`);
  }

  const data = await res.json();
  const candidate = data.candidates?.[0];
  const text = candidate?.content?.parts?.[0]?.text;

  if (!text) {
    throw new Error('Gemini geçerli bir yanıt üretmedi.');
  }

  // Parse the raw JSON string from Gemini
  try {
    const cleanText = text.trim();
    // In case Gemini still adds markdown backticks despite instructions
    const jsonStr = cleanText.replace(/^```json/, '').replace(/```$/, '').trim();
    const parsed = JSON.parse(jsonStr);
    return parsed;
  } catch (err) {
    throw new Error('Gemini yanıtı geçerli bir JSON formatında değil.');
  }
}

/**
 * Groq API (OpenAI Compatible)
 */
export async function analyzeWithGroq({ raporMetni, kategori, hedefKitle }) {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;
  if (!apiKey || apiKey === 'YOUR_GROQ_API_KEY_HERE') {
    throw new Error('Lütfen Groq API anahtarınızı .env dosyasına ekleyin.');
  }

  const systemPrompt = buildGeminiSystemPrompt({ kategori, hedefKitle });
  const userContent = `Aşağıdaki ${kategori} raporunu analiz et:\n\n${raporMetni}`;

  const body = {
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userContent }
    ],
    temperature: 0.1,
    max_tokens: 2048,
    response_format: { type: "json_object" }
  };

  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey.trim()}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(`Groq API Hatası (${res.status}): ${errData.error?.message || 'Bilinmeyen hata'}`);
    }

    const data = await res.json();
    const text = data.choices?.[0]?.message?.content;

    if (!text) {
      throw new Error('Groq geçerli bir yanıt üretmedi.');
    }

    return JSON.parse(text);
  } catch (err) {
    if (err instanceof Error) throw err;
    throw new Error('Groq analiz işlemi başarısız oldu.');
  }
}

