# MedNav - Kullanıcı Akışı (User Flow)

Bu belge, bir kullanıcının MedNav uygulamasına girdiği andan PDF çıktısını aldığı ana kadar yaşadığı deneyimi adım adım listelemektedir.

## 1. Karşılama ve Seçim Ekranı
* **Kullanıcı Ne Görür?** Temiz, güven veren ve tıbbi karmaşadan uzak bir giriş arayüzü. Ekranda 3 adet kategori kartı (Tahlil, Görüntüleme, Patoloji) ve "Bu rapor kimin için?" sorusunu soran bir Persona seçici (Kendim, Çocuğum, Yaşlı Yakınım) bulunur.
* **Kullanıcı Ne Yapar?** Elindeki tıbbi rapora en uygun kategoriyi seçer ve raporun kime ait olduğunu (personayı) işaretler.

## 2. Veri Girişi
* **Kullanıcı Ne Görür?** "Hastane çıktısı veya e-Nabız metnini buraya kopyalayın" yazan geniş bir metin kutusu ve altında "Analiz Et" butonu.
* **Kullanıcı Ne Yapar?** Anlamadığı, karmaşık tıbbi terimlerle dolu hastane raporunu kopyalayıp bu kutuya yapıştırır ve "Analiz Et" butonuna tıklar.

## 3. Yapay Zeka İşlem Süreci
* **Kullanıcı Ne Görür?** Ekranda profesyonel bir yükleniyor (loading) animasyonu belirir. "Yapay zeka raporunuzu inceliyor..." gibi rahatlatıcı bir mesaj çıkar.
* **Sonuç Ne Olur?** Arka planda Llama 3 (Groq API) devreye girer. Metni analiz eder, personaya uygun üslubu belirler, anatomik koordinatları hesaplar ve sağlık metriklerini puanlar.

## 4. Sonuç Ekranı (Klinik Dashboard)
* **Kullanıcı Ne Görür?** Saniyeler içinde 3 ana bölmeli, interaktif bir sonuç panosu açılır:
    * **Sol Bölme:** İnsan anatomisi figürü ve tam sorunlu organın üzerinde parlayan kırmızı bir hedef halkası.
    * **Orta Bölme:** Seçtiği personaya uygun (örn: şefkatli veya pedagojik) yazılmış, Latince kelimelerden arındırılmış bir ön teşhis özeti. Özetteki bazı kelimelerin altı çizilidir. Hemen altında "Doktorunuza Sorabileceğiniz 3 Soru" listesi yer alır.
    * **Sağ Bölme:** Hastanın Metabolizma, Bağışıklık, Enerji gibi 5 sağlık değerini gösteren dinamik bir "Örümcek Haritası" (Radar Chart).
* **Kullanıcı Ne Yapar?** Kendi dilinde yazılmış metni rahatça okur. Altı çizili zor tıbbi terimlerin üzerine faresini getirir (hover).
* **Sonuç Ne Olur?** Üzerine geldiği kelimenin Türkçe ve anlaşılır açıklaması küçük bir bilgi kutucuğunda (tooltip) anında belirir. 

## 5. Sağlık Asistanı ile Etkileşim
* **Kullanıcı Ne Görür?** Ekranın en altında "Llama-3 Sağlık Asistanı" adında bir sohbet kutusu (chatbot) bulunur.
* **Kullanıcı Ne Yapar?** Özeti okuduktan sonra aklına takılan spesifik bir soruyu (Örn: "Beslenmemde nelere dikkat etmeliyim?") buraya yazar.
* **Sonuç Ne Olur?** Asistan, kullanıcının raporunu ve kimin için sorduğunu bilerek, bağlamdan kopmadan kişiselleştirilmiş anlık bir cevap verir.

## 6. PDF Çıktısı Alma (Final)
* **Kullanıcı Ne Görür?** Ekranın üst köşesinde "PDF İndir" butonu.
* **Kullanıcı Ne Yapar?** Doktor randevusuna giderken bu değerli bilgileri yanında götürmek için butona tıklar.
* **Sonuç Ne Olur?** Sistem, interaktif kırmızı işaretçiyi gizleyip yerine "BÖLGESEL ODAK: [TÜRKÇE ORGAN ADI]" yazan resmi bir etiket koyarak, tüm bu Dashboard'u jilet gibi tasarlanmış, tıbbi standartlara uygun A4 formatında bir PDF belgesi olarak cihazına indirir. Kullanıcı stressiz ve bilinçli bir şekilde uygulamadan ayrılır.
