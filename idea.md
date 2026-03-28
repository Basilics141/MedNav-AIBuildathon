# MedNav - idea.md

**Problem: Ne çözüyorum?**
Hastalar, e-Nabız veya hastane sistemlerinden aldıkları tahlil, görüntüleme ve patoloji raporlarındaki karmaşık tıbbi jargonu anlayamıyor. Tıbbi terimlerin yarattığı bilgi asimetrisi, hastaların doktor randevusuna kadar geçen sürede büyük bir stres, kafa karışıklığı ve anksiyete yaşamasına neden oluyor.

**Kullanıcı: Bu uygulamayı kim kullanacak?**
Kendi veya bir yakınının karmaşık tıbbi raporunu (MR, kan tahlili, biyopsi vb.) anlamlandırmak isteyen, tıbbi eğitimi olmayan standart vatandaşlar.

**AI'ın Rolü: Yapay zeka bu çözümde ne yapıyor?**
Yapay zeka (Llama 3 NLP motoru), projede çok yönlü bir sağlık asistanı olarak çalışır:
1. Karmaşık metni analiz eder ve kullanıcıya empati odaklı, sade bir dille özetler.
2. Metin içindeki zor tıbbi terimlerin üzerine gelindiğinde (hover) anında anlaşılır Türkçe açıklamalar sunar.
3. Raporun klinik odak noktasını tespit ederek interaktif SVG anatomik harita üzerinde nokta atışı işaretler.
4. Rapor verilerinden yola çıkarak hastanın Bağışıklık, Metabolizma, Enerji gibi bütünsel sağlık metriklerini bir "Örümcek Haritası" (Radar Chart) ile görselleştirir.
5. Özel entegre edilmiş "Llama-3 Sağlık Asistanı" chatbotu ile kullanıcının rapora dair aklına takılan anlık soruları yanıtlar.

**Rakip Durum: Benzer çözümler var mı? Benimki nasıl farklı?**
Genel amaçlı yapay zeka araçları (ChatGPT, Claude) sadece düz metin özetleri verebilmektedir. MedNav ise metin tabanlı bir araç olmaktan çıkıp; görsel anatomi eşleştirmesi, interaktif genel sağlık örümcek haritası, kelime açıklayıcı vurgular (tooltip) ve anlık soru-cevap chatbotunu tek bir profesyonel klinik "Dashboard" (Kontrol Paneli) içinde birleştiren, kullanıcı dostu spesifik bir sağlık navigatörüdür.

**Başarı Kriteri: Bu proje başarılı olursa ne değişecek?**
Bir vatandaş, karmaşık bir tıbbi raporu sisteme yapıştırdıktan sonra saniyeler içinde hastalığının ne olduğunu kendi dilinde (şefkatli bir üslupla) anlayacak, vücudundaki tam yerini ve genel sağlık verilerini grafikler üzerinden görecek, bilmediği kelimeleri anında öğrenecek ve entegre asistanla konuşarak doktorunun karşısına %100 bilinçli ve stressiz bir şekilde çıkabilecektir.