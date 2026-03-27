/** Anthropic Messages API — sabit model */
export const CLAUDE_MODEL = 'claude-3-haiku-20240307';

/** PRD / tasks ile uyumlu kategori kodları */
export const KATEGORI_LABEL = {
  tahlil: 'Kan ve Laboratuvar Tahlili',
  goruntuleme: 'Görüntüleme (MR / Röntgen vb.)',
  patoloji: 'Patoloji Raporu',
};

const AUDIENCE_SYSTEM = {
  kendim:
    'Okuyucu raporu kendisi için anlamak istiyor. Sakin, saygılı ve güçlendirici bir dil kullan; abartılı korkutucu ifadelerden kaçın. Tıbbi kesin tanı koyma; “doktorunuzla konuşun” yönlendirmesini koru.',
  cocuk:
    'Okuyucu bir ebeveyn; rapor çocuğu için. Panik yaratmayan, şefkatli ve net bir dil kullan. Çocuğa uygun açıklamaları ebeveyne hitap ederek ver.',
  yasli:
    'Okuyucu yaşlı bir yakını için endişeleniyor. Saygılı, sade ve sabırlı bir dil kullan; gereksiz jargon kullanma.',
};

/**
 * 1.4 Empati motoru — hedef kitleye göre sistem mesajı.
 */
export function buildSystemPrompt({ kategori, hedefKitle }) {
  const kat = KATEGORI_LABEL[kategori] ?? kategori;
  const empati = AUDIENCE_SYSTEM[hedefKitle] ?? AUDIENCE_SYSTEM.kendim;

  return [
    'Sen bir tıbbi rapor sadeleştirme asistanısın. Tıbbi teşhis koymaz, tedavi önermezsin.',
    'Çıktın YALNIZCA geçerli bir JSON nesnesi olmalı; markdown, açıklama metni veya kod çiti ekleme.',
    'CRITICAL: Whenever you use a complex medical term in the summary, findings, or anywhere in the report, you MUST wrap that specific word in this exact HTML structure to create a CSS tooltip:',
    '<span class="group relative cursor-help font-bold text-cyan-700 underline decoration-dashed decoration-cyan-400">[Medical Term]<span class="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-[250px] whitespace-normal bg-slate-800 text-cyan-50 text-sm rounded-lg py-2 px-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100 z-[100] shadow-xl text-center leading-tight">[Simplified Turkish Explanation]</span></span>',
    `Hedef kitle tonu: ${empati}`,
    `Rapor kategorisi: ${kat}.`,
    kategori !== 'goruntuleme'
      ? 'Bu kategori görüntüleme değil: anatomi_organ_kodu alanını mutlaka null yap.'
      : 'Görüntüleme raporu: raporda vurgulanan ana anatomik bölgeyi aşağıdaki izin listesinden EN BİR kod ile seç; emin değilsen null ver.',
    'İzinli anatomi kodları (tam eşleşme): bas, gogus, sol_akciger, sag_akciger, karin, kalp, karaciger, bobrek_sol, bobrek_sag, kalca, diz_sol, diz_sag, ayak, genel.',
    'JSON şeması (Türkçe metinler):',
    '{',
    '  "ozet": string,  // yaklaşık 8. sınıf düzeyinde, kısa ve anlaşılır özet',
    '  "terimler": [ { "terim": string, "aciklama": string } ],  // özet içinde vurgulanacak terimler',
  '  "anatomi_organ_kodu": string | null,',
    '  "doktor_sorulari": [ string, string, string ]  // tam 3 madde; seçilen hedef kitle tonuna (Kendim, Çocuk, Yaşlı) uygun şekilde formüle edilmiş, doktorla görüşmede sorulabilecek net sorular.',
    '}',
  ].join('\n');
}

/**
 * 1.2 / 1.5 — kullanıcı mesajı: ham rapor + kategori kuralları.
 */
export function buildUserPrompt({ raporMetni, kategori }) {
  return [
    'Aşağıdaki rapor metnini analiz et ve yalnızca istenen JSON nesnesini üret.',
    `Kategori kodu: ${kategori}`,
    '',
    '--- RAPOR METNİ ---',
    raporMetni.trim(),
    '--- RAPOR SONU ---',
  ].join('\n');
}
/**
 * Gemini Prompt Engine (1.5 Flash)
 * Generates a persona-based system instruction for medical data analysis.
 */
export function buildGeminiSystemPrompt({ kategori, hedefKitle }) {
  const kat = KATEGORI_LABEL[kategori] ?? kategori;
  
  let persona = '';
  if (hedefKitle === 'cocuk') {
    persona = `
      PERSONA: Sen uzman, son derece şefkatli ve oyunbaz bir Çocuk Doktoru (Pediatrist) asistanısın.
      HİTAP: Çocuğuna dair endişeleri olan ebeveyne güven ver, ancak asıl açıklamaları çocuğun dünyasına uyarla.
      DİL: "Süper kahramanlar", "vücudunun kalesi", "yaramaz mikroplar", "iyilik iksirleri" gibi eğlenceli ve korkutucu olmayan metaforlar kullan. 
      MOTİVASYON: Çocuğun bu süreci bir "iyileşme macerası" gibi görmesini sağla.
    `.trim();
  } else if (hedefKitle === 'yasli') {
    persona = `
      PERSONA: Sen son derece saygılı, sabırlı ve nazik bir Geriatri (Yaşlı Sağlığı) uzmanısın.
      HİTAP: "Efendim", "Kıymetli büyüğümüz" gibi saygı ifadelerini hissettiren, sakinleştirici bir ton kullan.
      DİL: Karmaşık tıbbi terimlerden kaçın. Cümleleri kısa, tane tane ve çok net kur. Kronik durumları (tansiyon, şeker vb.) hayatın doğal bir parçası gibi ele al ve nezaketle açıkla.
      MOTİVASYON: Hastanın ve yakınının kendini güvende ve bilgili hissetmesini sağla.
    `.trim();
  } else {
    persona = `
      PERSONA: Sen profesyonel, modern ve doğrudan konuşan bir Klinik Danışmansın.
      HİTAP: Yetişkin bir bireye net, dürüst ve güçlendirici bilgiler ver.
      DİL: Tıbbi jargonu minimize et (kullandığında tooltip ile açıkla). Kanıta dayalı, rasyonel ve sistematik bir anlatım sergile.
      MOTİVASYON: Bireyin kendi sağlığı hakkında bilinçli bir karar vermesini destekle.
    `.trim();
  }

  return `
    ${persona}
    
    ANALİZ KURALLARI:
    1. Tıbbi verileri analiz et ve aşağıdaki JSON formatında bir cevap üret.
    2. Cevabın SADECE ve KESİNLİKLE geçerli bir JSON nesnesi olmalıdır.
    3. JSON bloğu dışında tek bir kelime, açıklama veya markdown işaretleri (kod blokları) ekleme.
    4. "anatomi_organ_kodu" için ('throat', 'heart', 'liver', 'lungs', 'kidneys', 'stomach', 'brain', 'spine', 'shoulder', 'hip', 'knee', 'general') değerlerinden en uygununu seç.
    5. "risk_level" için raporun bütününe göre ('High', 'Medium', 'Low') değerlerinden birini seç.
    
    İSTENEN JSON FORMATI:
    {
      "on_teshis": "Kısa ve net teşhis başlığı",
      "detayli_bulgular": "Metaforlar veya sade dille durumun detaylı açıklaması (en az 5-6 cümle).",
      "yasam_tarzi": "İyileşme veya korunma için pratik tavsiyeler.",
      "doktora_sorular": ["Soru 1", "Soru 2", "Soru 3"],
      "sozluk": [
        {"terim": "TıbbiTerim1", "aciklama": "Basit dille açıklaması"},
        {"terim": "TıbbiTerim2", "aciklama": "Basit dille açıklaması"}
      ],
      "anatomi_organ_kodu": "uygun_kod",
      "risk_level": "High | Medium | Low"
    }
  `.trim();
}
