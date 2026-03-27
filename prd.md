# PRD: Med-Nav (Bütüncül Sağlık Navigatörü)

## 1. Projenin Özeti
Med-Nav, hastaların karmaşık tıbbi raporlarını (tahlil, röntgen, patoloji) kendi anlama seviyelerine göre sadeleştiren, tıbbi jargonu açıklayan ve bir sonraki doktor randevusu için eyleme geçirilebilir sorular üreten mini bir web uygulamasıdır.

## 2. Kullanıcı Ne Yapar? (Kullanıcı Deneyimi)
* **Kategori Seçimi:** Uygulamaya girer ve elindeki raporun türünü seçer (Örn: Kan Tahlili, Görüntüleme Raporu).
* **Veri Girişi ve Hedef Kitle Seçimi:** Kopyaladığı karmaşık rapor metnini büyük bir metin kutusuna yapıştırır. Kutunun altında uygulamanın kime hitap edeceğini seçer ("Kendim İçin", "Çocuğum İçin", "Yaşlı Yakınım İçin").
* **Analiz İsteği:** "Raporumu Çevir" butonuna basar.
* **Sonuçları İnceleme:** Ekrana gelen modern kontrol panelinde (dashboard) raporun anlaşılır özetini okur. Metindeki zor kelimelerin üzerine fareyle gelerek (hover) basit anlamlarını görür. Eğer bir MR/Röntgen raporuysa, ekrandaki insan vücudu çizimi (SVG) üzerinde hastalıklı bölgenin renklendiğini fark eder.
* **Aksiyon Alma:** Sayfanın sağında yapay zekanın ürettiği "Doktorunuza Soracağınız 3 Soru" listesini alır ve dilerse PDF olarak indirir.

## 3. Yapay Zeka (AI) Ne Yapar? (Arka Plan Mantığı)
Bu uygulamada yapay zeka (**Claude**, Anthropic), Anthropic API üzerinden alınan API anahtarı ile entegre edilir ve sistemin "kalbi" olarak çalışır. Üretimde kullanılan model: **`claude-3-haiku-20240307`**.
* **Empati Motoru:** Kullanıcının seçtiği hedef kitleye göre (örn: çocuksa ebeveyni panikletmeyen şefkatli bir dil) Sistem Mesajını (Prompt) ayarlar.
* **Yapılandırılmış Veri (JSON) Üretimi:** Claude, metni okuduktan sonra arayüzün anlayabileceği düzenli bir JSON veri paketi gönderir. Bu paketin içinde şunlar vardır:
  * Raporun 8. sınıf seviyesinde özeti.
  * Vurgulanacak tıbbi terimler ve karşılıkları.
  * İnteraktif insan anatomisi haritasında renklenecek organın kodu (Örn: `sol_akciger`).
  * Doktora sorulacak 3 eyleme geçirilebilir soru.
* **Formatlama:** AI, bu veriyi doğrudan ekrandaki şık kutucuklara ve görsel bileşenlere yerleşecek şekilde hazırlayıp Frontend'e (ön yüze) iletir.

## 4. Hangi Ekranlar Olacak?
Uygulama, görsel olarak zengin ancak Lovable ile saniyeler içinde yayınlanabilecek 2 ana ekrandan oluşacaktır.

### Ekran 1: Karşılama ve Veri Girişi Ekranı
* **Başlık:** "Anlaşılmaz tıbbi raporları, sağlık adımlarına dönüştürün."
* **Kategori Kartları:** Tahlil, Görüntüleme ve Patoloji olarak ayrılmış 3 şık, tıklanabilir kart.
* **Girdi Alanı:** Kategori seçilince beliren geniş metin kutusu.
* **Kişiselleştirme Butonları:** "Kendim / Çocuğum / Yaşlı Yakınım" seçenekleri (Radyo butonları veya sekmeler).
* **Aksiyon Butonu:** "Analiz Et" butonu. Tıklandığında tatlı bir yükleme animasyonu çıkar.

### Ekran 2: Sonuç Paneli (Dashboard)
Bu ekran 3 ana bloğa bölünmüş modern bir yapıdır:
* **Sol Blok (Görsel Harita):** İnsan silüeti (SVG). Raporun içeriğine göre ilgili organ/bölge renkli olarak parlar.
* **Orta Blok (Çeviri ve Sözlük):** Raporun sade özeti. Tıbbi kelimelerin üzeri renklidir, fareyle üzerine gelince açıklama baloncuğu (tooltip) açılır.
* **Sağ Blok (Eylem Planı):** "Doktorunuza Sorun" başlığı altında 3 madde. Altında "PDF Olarak İndir" butonu.