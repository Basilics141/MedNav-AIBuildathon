# Teknoloji Seçimi (Tech Stack): Med-Nav

**Bağlayıcı karar (görev 0.1):** Aşağıdaki yığın proje için kesin seçimdir; uygulama kodu bu karara göre yazılır.

## Seçilen Teknolojiler

* **Derleme / geliştirme:** [Vite](https://vitejs.dev/) (`npm run dev`, `npm run build`, `npm run preview`)
* **Frontend (Arayüz):** HTML5, Tailwind CSS (CDN), Vanilla JavaScript (ES modülleri)
* **Yapay Zeka (AI):** Anthropic **Claude API** — model: **`claude-3-haiku-20240307`**
* **İstemci ortam değişkeni:** **`VITE_CLAUDE_API_KEY`** (`.env`; Vite yalnızca `VITE_` önekli anahtarları `import.meta.env` ile paketler)
* **Yayınlama (Deploy):** Lovable
* **Geliştirme Ortamı:** Cursor Editor (Agent Modu)

## Anthropic API — tarayıcıdan istek (CORS) header kuralı

Tarayıcıdan doğrudan Anthropic Messages API’ye istek atılacaksa, Anthropic’in öngördüğü güvenlik onayı için **tüm API isteklerinde** şu HTTP başlığı gönderilmelidir:

| Başlık | Değer |
|--------|--------|
| `anthropic-dangerous-direct-browser-access` | `true` |

Bu başlık, anahtarın istemcide görünmesi riskini kabul ettiğinizi belirtir; mümkünse üretimde anahtarı yalnızca sunucu veya barındırma ortamının gizli değişkenlerinde tutmayı tercih edin.

## Neden Bu Teknolojileri Seçiyoruz?

1. **HTML/Vanilla JS:** Başlangıç seviyesi için en kolay öğrenilen ve hatası en rahat çözülen yapıdır. Karmaşık React veya Node.js kurulumları gerektirmez; Vite ile geliştirme ve üretim paketleme hızlı kalır.
2. **Tailwind CSS:** Klasik ve uzun CSS dosyaları yazmak yerine, Cursor'ın çok hızlı bir şekilde modern, şık ve mobil uyumlu UI bileşenleri tasarlamasını sağlar.
3. **Claude API (Haiku):** Anthropic üzerinden erişilen API, tıbbi rapor metinlerini işleyip arayüzümüze JSON döndürmek için uygundur; **`claude-3-haiku-20240307`** hız ve maliyet dengesi için uygundur.
4. **Lovable:** GitHub repomuzu bağladığımız an uygulamayı hızlıca yayınlamamıza yardımcı olur. Ücretsiz planı bu proje için genelde yeterlidir.

## Kurulum Adımları

1. **Cursor Hazırlığı:** cursor.com'dan editörü indirin. Projeyi Cursor'da açın.
2. **Bağımlılıklar:** Proje kökünde `npm install` çalıştırın.
3. **Ortam:** `.env.example` dosyasını `.env` olarak kopyalayın; **`VITE_CLAUDE_API_KEY`** değerini [Anthropic Console](https://console.anthropic.com) anahtarınızla doldurun. Sunucuyu yeniden başlatın (`npm run dev`).
4. **API istekleri:** İsteklerde **`anthropic-dangerous-direct-browser-access: true`** başlığını kullanın ([yukarıdaki tablo](#anthropic-api--tarayıcıdan-istek-cors-header-kuralı)).
5. **Yayınlama:** `npm run build` çıktısını barındırın veya Lovable / benzeri platformda `VITE_CLAUDE_API_KEY` gibi gizli değişkenleri panelden tanımlayın.
