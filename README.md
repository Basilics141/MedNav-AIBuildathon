# MedNav - Yapay Zeka Destekli Sağlık Navigatörü

## 🎯 Problem
Hastaların karmaşık tıbbi tahlil, MR (görüntüleme) ve patoloji raporlarını içerdikleri yoğun tıbbi terimler yüzünden anlayamaması. Bu durumun hastada endişe yaratması ve doktor-hasta iletişiminde ciddi bir kopukluğa, zaman kaybına yol açması.

## 💡 Çözüm
MedNav, karmaşık tıbbi verileri saniyeler içinde herkesin anlayabileceği sade bir dile çeviren bir yapay zeka asistanıdır. Groq API (Llama 3) kullanılarak geliştirilen bu sistem; sıradan bir çevirici değil, hastanın profiline (çocuk, yetişkin, yaşlı) göre dilini ayarlayabilen dinamik bir 'Agent' mimarisine sahiptir. Teşhisleri sadece metinle bırakmaz; radar grafikleri ve anatomik vücut haritaları ile görselleştirir, hastanın doktoruna sorabileceği soruları hazırlar ve tüm bu verileri tek tıkla cihaz bağımsız bir PDF raporuna dönüştürür.

## 🚀 Canlı Demo
- **Yayın Linki:** https://mednav-ai-analiz.netlify.app/
- **Demo Video:** https://www.loom.com/share/c1984a476403404897623fedd519924b

## 📖 Portfolyo ve Proje Hikayesi (Bonus)
Sağlık verileri, hayatımızın en kritik bilgileri olmasına rağmen genellikle soğuk ve anlaşılmaz tıbbi terimlerin ardına saklanmış durumdadır. Eğitim hayatımda algoritmaların ve yapay zekanın gücünü derinlemesine keşfettikçe, teknolojinin sadece ekrandaki sayılardan ibaret olmaması gerektiğine; doğrudan insan hayatına dokunan, karmaşık problemleri çözen bir köprü olması gerektiğine inandım. MedNav projesi de tam olarak bu mühendislik vizyonuyla doğdu.

Uygulamayı tasarlarken statik bir çeviri yerine dinamik bir mimari kurgulayarak, yapay zekanın hastanın bilgi düzeyine göre empati kurabilmesini sağladım. Verileri sadece metin olarak sunmakla kalmadım; interaktif anatomik haritalar ve radar grafikleriyle görsel bir deneyime dönüştürdüm. Geliştirdiğim yazdırma algoritması sayesinde ise bu analizlerin kusursuz bir PDF'e dönüşmesini başardım. MedNav, karmaşık sistemleri herkes için erişilebilir ve şeffaf kılma tutkumun en somut yansımasıdır.

<img width="1919" height="907" alt="Ekran görüntüsü 1" src="https://github.com/user-attachments/assets/b400869f-babd-494d-b1e0-d21308378013" />
<img width="1919" height="910" alt="Ekran görüntüsü 2" src="https://github.com/user-attachments/assets/63055162-6bd1-479f-b09e-9c79dc949cbe" />
<img width="1917" height="949" alt="Ekran görüntüsü 3" src="https://github.com/user-attachments/assets/a570c0fd-21aa-434f-993d-e5bb2e005eaf" />


## 🛠️ Kullanılan Teknolojiler
- **Yapay Zeka:** Groq API (Meta Llama-3-70b-8192), Gemini Pro 3.1
- **Frontend:** HTML5, Vanilla JavaScript, CSS3
- **Stil & Tasarım:** Tailwind CSS
- **Kütüphaneler:** html2pdf.js, Chart.js 
- **Deployment:** Netlify, GitHub

## ⚙️ Nasıl Çalıştırılır?
1. Repoyu bilgisayarınıza klonlayın:
   `git clone https://github.com/KullaniciAdin/MedNav.git`
2. Klasöre gidin ve proje dosyalarını VS Code (veya Cursor) ile açın.
3. `api.js` (veya ilgili js dosyası) içindeki API Key alanına kendi Groq API anahtarınızı ekleyin.
4. Terminalde yerel bir sunucu başlatın (örn: `npm run dev` veya Live Server eklentisi ile `index.html` dosyasını açın).
