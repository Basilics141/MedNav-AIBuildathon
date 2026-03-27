/**
 * Claude yanıtından JSON çıkarır ve PRD şemasına göre doğrular (1.3, 1.6).
 */

function extractJsonObject(text) {
  const trimmed = String(text ?? '').trim();
  if (!trimmed) throw new Error('Model boş yanıt döndü.');

  const fence = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const raw = fence ? fence[1].trim() : trimmed;

  const start = raw.indexOf('{');
  const end = raw.lastIndexOf('}');
  if (start === -1 || end === -1 || end <= start) {
    throw new Error('Yanıtta geçerli bir JSON nesnesi bulunamadı.');
  }

  return JSON.parse(raw.slice(start, end + 1));
}

function isNonEmptyString(v) {
  return typeof v === 'string' && v.trim().length > 0;
}

/**
 * @param {unknown} data
 * @param {string} kategori
 */
export function validateAnalysisResult(data, kategori) {
  if (!data || typeof data !== 'object') {
    throw new Error('Geçersiz veri yapısı.');
  }

  // Schema A: Standard (ozet, terimler...)
  // Schema B: Gemini (on_teshis, detayli_bulgular, sozluk...)
  const isGemini = !!(data.on_teshis || data.detayli_bulgular || data.sozluk);

  if (isGemini) {
    const { on_teshis, detayli_bulgular, yasam_tarzi, doktora_sorular, sozluk, anatomi_organ_kodu } = data;
    
    if (!isNonEmptyString(on_teshis)) throw new Error('on_teshis alanı eksik veya boş.');
    if (!isNonEmptyString(detayli_bulgular)) throw new Error('detayli_bulgular alanı eksik veya boş.');
    if (!Array.isArray(doktora_sorular) || doktora_sorular.length < 1) throw new Error('Doktora soruları listesi geçersiz.');
    if (!Array.isArray(sozluk)) throw new Error('Sözlük listesi geçersiz.');

    return {
      isGemini: true,
      on_teshis: on_teshis.trim(),
      detayli_bulgular: detayli_bulgular.trim(),
      yasam_tarzi: (yasam_tarzi || '').trim(),
      doktora_sorular: doktora_sorular.map(q => q.trim()),
      sozluk: sozluk.map(s => ({
        terim: s.terim?.trim() || '',
        aciklama: s.aciklama?.trim() || ''
      })),
      anatomi_organ_kodu: anatomi_organ_kodu || null
    };
  }

  const { ozet, terimler, anatomi_organ_kodu, doktor_sorulari } = data;

  if (!isNonEmptyString(ozet)) {
    throw new Error('Özet alanı eksik veya boş.');
  }

  if (!Array.isArray(terimler)) {
    throw new Error('Terimler listesi geçersiz.');
  }

  for (const t of terimler) {
    if (!t || typeof t !== 'object') throw new Error('Terim girdisi geçersiz.');
    if (!isNonEmptyString(t.terim) || !isNonEmptyString(t.aciklama)) {
      throw new Error('Her terim için "terim" ve "aciklama" dolu olmalı.');
    }
  }

  if (!Array.isArray(doktor_sorulari) || doktor_sorulari.length !== 3) {
    throw new Error('Doktora sorulacak tam 3 soru üretilmeli.');
  }

  for (const q of doktor_sorulari) {
    if (!isNonEmptyString(q)) throw new Error('Soru maddeleri boş olamaz.');
  }

  let organ = anatomi_organ_kodu;
  if (organ !== null && organ !== undefined && typeof organ !== 'string') {
    throw new Error('Anatomi kodu metin veya null olmalı.');
  }
  if (typeof organ === 'string' && organ.trim() === '') organ = null;

  if (kategori !== 'goruntuleme' && !isGemini) {
    organ = null;
  }

  return {
    isGemini: false,
    ozet: ozet.trim(),
    terimler: terimler.map((t) => ({
      terim: t.terim.trim(),
      aciklama: t.aciklama.trim(),
    })),
    anatomi_organ_kodu: organ,
    doktor_sorulari: doktor_sorulari.map((q) => q.trim()),
  };
}

export function parseClaudeAnalysis(text, kategori) {
  try {
    const raw = extractJsonObject(text);
    return validateAnalysisResult(raw, kategori);
  } catch (e) {
    if (e instanceof SyntaxError) {
      throw new Error('Model yanıtı geçerli JSON değil. Lütfen yeniden deneyin.');
    }
    throw e instanceof Error ? e : new Error(String(e));
  }
}
