# MedNav - Teknoloji Yığını (Tech Stack)

Bu proje, başlangıç seviyesindeki geliştiriciler için en basit, en hızlı çalışan ve karmaşık kurulumlar gerektirmeyen araçlar seçilerek tasarlanmıştır. Amacımız altyapıda kaybolmak değil, yapay zekanın gücünü en hızlı şekilde kullanıcıya ulaştırmaktır.

## 1. Kullanılan Teknolojiler ve Seçim Nedenlerimiz

### A. Frontend (Kullanıcı Arayüzü)
* **HTML5, CSS3, Vanilla JavaScript (Saf JS)**
* **Neden Seçtik?** React veya Vue gibi karmaşık framework'ler (çerçeveler) öğrenme eğrisi gerektirir ve ekstra kurulum adımları (npm install vb.) ister. Bizim projemiz doğrudan tarayıcıda çalışan, sıfır kurulum gerektiren basit ama çok şık bir yapıya sahiptir. Anatomik haritadaki üzerine gelme (hover) efektleri ve terim sözlüğü (tooltip) tamamen saf CSS ve JS ile çözülmüştür.

### B. Yapay Zeka (AI Motoru ve Agent)
* **Groq Cloud API (Llama 3 Modeli)**
* **Neden Seçtik?** MedNav'ın beyni burasıdır. Tıbbi metinleri analiz etmek, 27 spesifik organı tespit etmek, doktora sorulacak 3 soruyu üretmek ve seçilen "Persona"ya (Çocuk, Yaşlı, Yetişkin) göre üslup değiştirmek için inanılmaz hızlı çalışan Groq altyapısını ve Llama 3 modelini kullandık. Groq, olağanüstü hızıyla (saniyede yüzlerce kelime) hasta bekleme süresini sıfıra indirir ve API entegrasyonu başlangıç seviyesi için bile son derece basittir.

### C. Veri Görselleştirme ve Çıktı Modülleri
* **Chart.js:** Hastanın "Bağışıklık, Metabolizma, Enerji" gibi 5 temel sağlık metriğini sağ paneldeki "Örümcek Haritası" (Radar Chart) üzerinde dinamik olarak çizdirmek için kullanıldı.
* **html2pdf.js:** Kullanıcının sonuç ekranını (Dashboard) doktora götürebilmesi için tek tıkla yüksek çözünürlüklü A4 PDF belgesine dönüştüren istemci tarafı (client-side) kütüphanedir.

### D. Yayınlama (Deployment)
* **Lovable / Netlify**
* **Neden Seçtik?** GitHub reposunu bağlayıp saniyeler içinde projeyi tüm dünyaya açmamızı sağlayan en pratik platformlardır.

---

## 2. Kurulum Adımları (Nasıl Çalıştırılır?)

Bu proje derleme gerektirmeyen (no-build) mimariyle yapılmıştır, bu yüzden kurulumu sadece birkaç saniye sürer:

**Adım 1: Projeyi İndirin**
GitHub reposundaki kodları bilgisayarınıza indirin (ZIP olarak veya `git clone` komutu ile).

**Adım 2: API Anahtarını Ekleyin**
1. `console.groq.com` adresine giderek ücretsiz bir Groq API anahtarı alın.
2. Proje klasöründeki `.env.example` dosyasının adını `.env` (veya kullandığınız yapılandırma dosyasına göre `api.js`) olarak değiştirin.
3. İçine `GROQ_API_KEY="BURAYA_ANAHTARINIZI_YAPISTIRIN"` yazıp kaydedin.

**Adım 3: Çalıştırın**
Klasörün içindeki `index.html` dosyasını Google Chrome veya tercih ettiğiniz bir tarayıcıda çift tıklayarak açın. (Tavsiye: Eğer VS Code veya Cursor kullanıyorsanız, projeyi "Live Server" eklentisiyle açmanız daha pratik olacaktır).

MedNav artık kullanıma hazırdır!
