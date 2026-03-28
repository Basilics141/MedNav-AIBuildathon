# MedNav - Geliştirme Görev Listesi

Bu liste [prd.md](./prd.md) Ürün gereksinim belgesine göre oluşturulmuştur. Görevleri sırayla fazlara bölerek ilerleyebilirsiniz.

---

## Faz 0: Proje Altyapısı ve Temel Arayüz

- [x] **0.1** Temel `index.html`, `style.css` ve `app.js` dosyalarını oluştur.
- [x] **0.2** Giriş ekranını tasarla: 3'lü Kategori seçici (Tahlil, Görüntüleme, Patoloji), Persona seçici (Kendim, Çocuğum, Yaşlı Yakınım) ve metin giriş kutusu (textarea) ekle.
- [x] **0.3** "Analiz Et" butonunu ve yükleniyor (loading) animasyonunu entegre et.

---

## Faz 1: Yapay Zeka (Llama 3 / Groq) Entegrasyonu

- [x] **1.1** Groq API bağlantısını kur ve `.env` (veya config) içine API anahtarını yerleştir.
- [x] **1.2** Sistem prompt'unu (System Message) ayarla: Kullanıcının seçtiği Kategori ve Persona'ya göre (örn: çocuk için pedagojik, yaşlı için şefkatli) yapay zekanın üslubunu dinamik olarak değiştirecek mantığı yaz.
- [x] **1.3** Yapay zekadan `JSON` formatında yapılandırılmış çıktı almayı sağla:
  - Şefkatli özet metni
  - Terim listesi (Tooltip için kelime ve açıklamalar)
  - 3 adet doktora sorulacak soru
  - 5 temel sağlık metriği puanı
  - Hedef organ/bölge kodu

---

## Faz 2: Sonuç Ekranı (Dashboard) - Sol ve Orta Panel

- [x] **2.1** İnsan vücudu SVG'sini sayfaya ekle ve 27 organın koordinatlarını içeren `anatomy_data.js` dosyasını oluştur.
- [x] **2.2** API'den dönen "Hedef Organ" verisine göre kırmızı işaretçiyi (marker) doğru koordinatta göster. Bulunamayan organlar için "Yakınsama / Güvenli Bölge" mantığını uygula.
- [x] **2.3** Orta panelde API'den gelen şefkatli özeti ekrana bas.
- [x] **2.4** Zor kelimelerin üzerine gelindiğinde Türkçe anlamını gösteren "Tooltip" (bilgi kutucuğu) CSS ve JS yapısını kur.
- [x] **2.5** Doktora sorulacak 3 soruyu liste halinde UI üzerine yerleştir.

---

## Faz 3: Sonuç Ekranı (Dashboard) - Sağ Panel (Örümcek Harita)

- [x] **3.1** Chart.js (veya benzeri bir kütüphane) kullanarak sağ panele "Örümcek Haritası" (Radar Chart) ekle.
- [x] **3.2** API'den dönen Bağışıklık, Metabolizma, Enerji gibi 5 sağlık metriği puanını bu grafiğe bağlayarak dinamik olarak çizdir.

---

## Faz 4: Llama-3 Asistan ve PDF Döküm Modülü

- [x] **4.1** Ekranın alt kısmına bir sohbet arayüzü ekle ve chatbot'u, raporun bağlamını ve seçilen personayı unutmayacak şekilde API'ye bağla.
- [x] **4.2** `html2pdf.js` kütüphanesini projeye dahil et ve "PDF İndir" işlevini yaz.
- [x] **4.3** PDF render edilirken kırmızı işaretçi animasyonunun bozulmasını önlemek için, işaretçiyi gizleyen ve yerine "BÖLGESEL ODAK: [ORGAN ADI]" yazan Türkçe metin etiketleme sistemini uygula.

---

## Faz 5: Son Kontroller ve Yayınlama

- [x] **5.1** Tasarımı mobil uyumlu (responsive) hale getir ve hata denetimlerini (boş metin girilmesi vb.) yap.
- [x] **5.2** Projeyi Lovable (veya Netlify/Vercel) üzerinden internete yayınla.
