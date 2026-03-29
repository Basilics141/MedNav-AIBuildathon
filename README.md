# MedNav

## Problem
Hastalar, e-Nabız veya hastane sistemlerinden aldıkları tahlil, görüntüleme ve patoloji raporlarındaki karmaşık tıbbi jargonu anlayamıyor. Tıbbi terimlerin yarattığı bu bilgi asimetrisi, hastaların doktor randevusuna kadar geçen sürede büyük bir stres, kafa karışıklığı ve anksiyete yaşamasına neden oluyor.

## Çözüm
MedNav, karmaşık tıbbi raporları saniyeler içinde analiz eden yapay zeka tabanlı bir sağlık navigatörüdür. Kullanıcı metni yapıştırdığında AI (Groq / Llama 3); kullanıcının seçtiği personaya (Kendim, Çocuğum, Yaşlı Yakınım) uygun empati odaklı bir özet sunar, zor kelimeleri açıklar (tooltip) ve doktora sorulabilecek 3 kritik soru üretir. Ayrıca raporun odaklandığı organı tespit ederek interaktif bir SVG insan haritası üzerinde gösterir, hastanın genel durumunu "Örümcek Haritası" (Radar Chart) ile görselleştirir ve tüm bu paneli hekimle paylaşmak üzere profesyonel bir PDF raporuna dönüştürür.

## Canlı Demo
Yayın Linki: https://[proje-adin].lovable.app
Demo Video: https://loom.com/share/[video-id]

## Kullanılan Teknolojiler
- HTML5, CSS3, Vanilla JavaScript
- Groq Cloud API (Llama 3 Modeli)
- Chart.js (Örümcek Haritası görselleştirmesi için)
- html2pdf.js (İstemci tarafı PDF dökümü için)
- Lovable / Netlify (Yayınlama altyapısı)

## Nasıl Çalıştırılır?
1. Repoyu bilgisayarınıza indirin veya klonlayın.
2. Proje klasöründeki `.env.example` dosyasının adını `.env` (veya projenizdeki yapılandırmaya göre `api.js`) olarak değiştirin.
3. İçine kendi Groq API anahtarınızı (`GROQ_API_KEY="BURAYA_ANAHTARINIZI_YAPISTIRIN"`) ekleyin.
4. Proje "no-build" mimarisiyle hazırlandığı için ekstra bir kuruluma (npm install vb.) gerek yoktur. Sadece `index.html` dosyasını tarayıcınızda açın veya VS Code üzerinden Live Server eklentisi ile çalıştırın.