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

### 🖼️ Ekran Görüntüleri

#### 💻 Masaüstü Görünümü
![Masaüstü Analiz] 
![Masaüstü 1](https://github.com/user-attachments/assets/b400869f-babd-494d-b1e0-d21308378013) 
![Masaüstü 2](https://github.com/user-attachments/assets/63055162-6bd1-479f-b09e-9c79dc949cbe) 
![Masaüstü 3](https://github.com/user-attachments/assets/a570c0fd-21aa-434f-993d-e5bb2e005eaf) 

#### 📱 Mobil Görünümü:

![Mobil 1](https://github.com/user-attachments/assets/5752faa1-f097-4d0e-8a70-d527bd6839b8) 
![Mobil 2](https://github.com/user-attachments/assets/5752faa1-f097-4d0e-8a70-d527bd6839b8) 
![Mobil 3](https://github.com/user-attachments/assets/ebdc278f-5b55-4fff-a3ae-f83f9b783a6c)
![Mobil 4](https://github.com/user-attachments/assets/433ce9e3-a3bb-4bf4-a4e7-45b27fed70a0)
![Mobil 5](https://github.com/user-attachments/assets/e435dd68-d001-43bc-a48c-180e4bf5e0ce)
![Mobil 6](https://github.com/user-attachments/assets/e5cb1d10-b221-4ddb-9559-51c0bdb0cbf5)


## 🛠️ Kullanılan Teknolojiler
- **Yapay Zeka:** Groq API (Meta Llama-3-70b-8192), Gemini Pro 3.1
- **Frontend:** HTML5, Vanilla JavaScript, CSS3
- **Stil & Tasarım:** Tailwind CSS
- **Kütüphaneler:** html2pdf.js, Chart.js 
- **Deployment:** Netlify, GitHub
​- **Geliştirme Ortamı & AI Asistanı:** Cursor IDE (Antigravity)

## ⚙️ Nasıl Çalıştırılır?
1. Repoyu bilgisayarınıza klonlayın:
   `git clone https://github.com/KullaniciAdin/MedNav.git`
2. Klasöre gidin ve proje dosyalarını VS Code (veya Cursor) ile açın.
3. `api.js` (veya ilgili js dosyası) içindeki API Key alanına kendi Groq API anahtarınızı ekleyin.
4. Terminalde yerel bir sunucu başlatın (örn: `npm run dev` veya Live Server eklentisi ile `index.html` dosyasını açın).
