# Med-Nav — Geliştirme Görev Listesi

Bu liste [prd.md](./prd.md) ürün gereksinim belgesine göre oluşturulmuştur. Görevleri sırayla veya fazlara bölerek ilerleyebilirsiniz.

---

## Faz 0: Proje altyapısı

- [x] **0.1** Teknoloji yığınına karar ver (ör. React + Vite, Next.js veya PRD’de geçen Lovable akışına uygun stack).
- [x] **0.2** Depoyu ve temel klasör yapısını oluştur (`src`, bileşenler, stiller, ortam değişkenleri).
- [x] **0.3** `.env` / `.env.example` ile **`VITE_CLAUDE_API_KEY`** (Anthropic Console; Vite `VITE_` öneki) tanımlamasını ekle; anahtarı asla repoya commit etme.
- [x] **0.4** Vite ile `npm run dev` / `npm run build` doğrulandı; ESLint ayarlı.

---

## Faz 1: Claude (Anthropic) entegrasyonu ve veri sözleşmesi

- [x] **1.1** Anthropic **Messages API** (REST) ile çağrı yapısını kur; model: **`claude-3-haiku-20240307`**. Tarayıcıdan doğrudan istekte **zorunlu** header: `anthropic-dangerous-direct-browser-access: true` ([tech-stack.md](./tech-stack.md)). API anahtarı: `import.meta.env.VITE_CLAUDE_API_KEY`.
- [x] **1.2** Yapay zekadan **yalnızca geçerli JSON** dönecek şekilde sistem + kullanıcı prompt’larını tasarla (`src/js/prompts.js`).
- [x] **1.3** JSON şeması PRD ile hizalı; dokümantasyon: `src/analysis-result.schema.json`, doğrulama: `src/js/parse.js`.
  - 8. sınıf seviyesinde özet metni
  - Terim listesi: `{ terim, aciklama }` (tooltip için)
  - Anatomi haritası: organ/bölge kodu — görüntüleme raporları için
  - Tam olarak **3 adet** doktora sorulacak soru
- [x] **1.4** Hedef kitleye göre **empati motoru** (`kendim` / `cocuk` / `yasli`) — `buildSystemPrompt`.
- [x] **1.5** Rapor kategorisi modele iletilir; görüntüleme dışında `anatomi_organ_kodu` `parse.js` içinde null’a zorlanır.
- [x] **1.6** API / ağ / JSON hatalarında kullanıcıya anlaşılır mesaj; form açık kalır (yeniden deneme).

---

## Faz 2: Ekran 1 — Karşılama ve veri girişi

- [x] **2.1** Ana başlık: *“Anlaşılmaz tıbbi raporları, sağlık adımlarına dönüştürün.”*
- [x] **2.2** Üç kategori kartı: **Tahlil**, **Görüntüleme**, **Patoloji** — tıklanabilir, seçim durumu belirgin.
- [x] **2.3** Kategori seçilince geniş **metin alanı**; metin state’te tutulur.
- [x] **2.4** Kişiselleştirme: **Kendim / Çocuğum / Yaşlı Yakınım** (radyo görünümlü etiketler).
- [x] **2.5** Birincil aksiyon metni: **Analiz Et** (PRD Ekran 1 ile uyumlu).
- [x] **2.6** Boş metin / eksik seçim doğrulaması.
- [x] **2.7** Yükleme ekranı (animasyonlu).
- [x] **2.8** Başarıda tek sayfada sonuç (dashboard) görünümü.

---

## Faz 3: Ekran 2 — Sonuç paneli (dashboard) düzeni

- [x] **3.1** Üç sütunlu layout: sol (SVG), orta (özet), sağ (sorular + yazdır).
- [x] **3.2** Responsive: mobilde özet üstte, harita ve sorular altta.
- [x] **3.3** Orta blokta özet kutusu ve tipografi.

---

## Faz 4: Orta blok — özet ve tooltip sözlük

- [x] **4.1** Terimler özet içinde **vurgulanır** (`wrapTermsInSummary`).
- [x] **4.2** Açıklama **`title`** ile hover tooltip (temel erişilebilirlik).
- [x] **4.3** Eşleşme **büyük/küçük harf duyarsız** regex ile.

---

## Faz 5: Sol blok — insan silüeti (SVG) haritası

- [x] **5.1** İnsan **SVG** silüeti; bölgeler `data-organ` kodlarıyla.
- [x] **5.2** Dönen koda göre bölge renklenir; `genel` için çerçeve vurgusu.
- [x] **5.3** Görüntüleme dışı kategorilerde harita soluklaştırılır + bilgi metni.

---

## Faz 6: Sağ blok — doktor soruları ve PDF

- [x] **6.1** “Doktorunuza soracağınız 3 soru” başlığı ve 3 madde.
- [x] **6.2** **PDF / Yazdır** — tarayıcı yazdırma ile çıktı (`@media print`, `.no-print`).
- [x] **6.3** Üst bilgilendirme / sorumluluk notu metni sonuç sayfasında.

---

## Faz 7: Kalite, güvenlik ve yayın

- [ ] **7.1** Kullanıcı metninin loglanmaması veya PII minimizasyonu politikası (GDPR / KVKK farkındalığı).
- [ ] **7.2** Rate limiting veya basit kötüye kullanım önlemi (sunucu tarafı varsa).
- [ ] **7.3** Temel manuel test senaryoları: üç kategori, üç hedef kitle, kısa/uzun metin, hatalı API.
- [ ] **7.4** Lovable veya seçilen platformda **deploy** ve ortam değişkenlerinin üretimde ayarlanması.

---

## İsteğe bağlı sonraki adımlar (PRD dışı iyileştirme)

- [ ] Geçmiş analizleri yerel depolama ile son X kayıt (gizlilik onayı ile).
- [ ] Çoklu dil (TR/EN) arayüz.
- [ ] Daha zengin anatomi haritası veya çoklu vurgu (birden fazla organ kodu şeması).

---

*Son güncelleme: PRD ile senkron, proje başlangıcı için görev sıralaması önerilir.*
