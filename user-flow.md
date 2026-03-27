# Kullanıcı Akışı (User Flow): Med-Nav

Bu belge, bir kullanıcının Med-Nav uygulamasına girdiği andan itibaren yaşayacağı deneyimi adım adım listelemektedir.

## Adım 1: Karşılama ve Kategori Seçimi
* **Kullanıcı Ne Görür?** Temiz, güven veren ve karmaşadan uzak bir ana sayfa. Ekranda "Anlaşılmaz tıbbi raporları, sağlık adımlarına dönüştürün" başlığı yer alır. Altında üç büyük kategori kartı bulunur: "Kan ve Laboratuvar Tahlili", "Görüntüleme Raporu (MR/Röntgen)" ve "Patoloji Raporu".
* **Kullanıcı Ne Yapar?** Elindeki raporun türüne en uygun olan kategori kartına tıklar.

## Adım 2: Veri Girişi ve Kişiselleştirme
* **Kullanıcı Ne Görür?** Seçtiği kategoriye özel geniş bir metin yapıştırma kutusu ve altında "Bu Rapor Kimin İçin?" sorusuyla birlikte üç adet seçenek (Kendim İçin, Çocuğum İçin, Yaşlı Yakınım İçin).
* **Kullanıcı Ne Yapar?** Hastane portalından veya e-Nabız'dan kopyaladığı karmaşık rapor metnini kutuya yapıştırır. Uygulamanın dilini (şefkatli, özet odaklı vb.) ayarlamak için hedef kitleyi seçer ve "Raporumu Çevir" butonuna basar.

## Adım 3: İşlem (Yüklenme Durumu)
* **Kullanıcı Ne Görür?** Ekrandaki metin kutusu kaybolur, yerine tatlı bir yüklenme animasyonu (örneğin atan bir kalp veya steteskop ikonu) ve "Raporunuz Şefkatle Çevriliyor..." yazısı gelir.
* **Kullanıcı Ne Yapar?** Arka planda Anthropic Claude API'nin (`claude-3-haiku-20240307`) raporu analiz edip yapılandırılmış JSON verisi üretmesini birkaç saniye bekler.

## Adım 4: Sonuç Paneli (Dashboard)
* **Kullanıcı Ne Görür?** Sayfa, 3 bloğa ayrılmış modern bir kontrol paneline dönüşür.
    * **Sol Blok:** İnsan vücudu silüeti. (Örneğin raporda dizden bahsediliyorsa, silüetin diz kısmı renkli olarak parlar).
    * **Orta Blok:** Raporun 8. sınıf seviyesinde, anlaşılır bir özeti. Metin içindeki zor tıbbi kelimeler renklidir.
    * **Sağ Blok:** "Doktorunuza Soracağınız 3 Soru" listesi ve "PDF Olarak İndir" butonu.
* **Kullanıcı Ne Yapar?** Özeti okur. Orta bloktaki renkli, zor kelimelerin üzerine faresini götürerek (hover) açılan küçük baloncuklardaki (tooltip) Türkçe açıklamaları okur. Görsel haritayı inceler.

## Adım 5: Aksiyon ve Çıkış
* **Kullanıcı Ne Görür?** Sağ bloktaki "PDF Olarak İndir" butonu.
* **Kullanıcı Ne Yapar?** Bir sonraki randevusunda unutmamak için bu butona tıklar. Uygulama, özeti ve doktor sorularını temiz bir PDF dosyası olarak cihaza kaydeder. Kullanıcı, raporunu anlamış ve ne yapacağını bilir bir şekilde uygulamadan ayrılır.
