# MedNav - PRD (Ürün Gereksinim Belgesi)

## 1. Uygulamanın Amacı (Ne Yapıyoruz?)
MedNav, hastaneden alınan ve içinde anlaşılmaz Latince kelimeler bulunan tıbbi raporları, herkesin anlayabileceği basit bir Türkçe'ye çeviren bir web uygulamasıdır. Amacımız, hastaların "Acaba neyim var?" korkusunu yenip, doktor karşısına bilinçli ve stressiz çıkmalarını sağlamaktır.

## 2. Kimler Kullanacak? (Hedef Kitle)
Tıp doktoru olmayan, karmaşık sağlık terimlerini anlamadığı için endişelenen standart vatandaşlar. Özellikle küçük çocuğu veya yaşlı anne/babası için endişelenen ve onların tahlil/MR sonuçlarını anlamaya çalışan hasta yakınları.

## 3. Ekranlar ve Kullanıcının Yapacakları (Adım Adım Kullanım)
Uygulama temel olarak çok sade bir giriş ekranı ve detaylı bir sonuç panosundan (Dashboard) oluşur:

* **Adım 1 (Veri Girişi):** Kullanıcı siteye girer. Raporun türünü (Tahlil, Görüntüleme, Patoloji) ve **kimin için** olduğunu (Kendim, Çocuğum, Yaşlı Yakınım) seçer. Hastane raporunu metin kutusuna yapıştırıp "Analiz Et" butonuna basar.
* **Adım 2 (Sonuç Ekranı):** Saniyeler içinde karşısına şu bölümlerden oluşan bir ekran gelir:
    * **İnsan Haritası:** Sol tarafta bir insan vücudu çizimi vardır. Raporda hangi organda sorun varsa, o organın üzerinde kırmızı bir ışık yanar.
    * **Şefkatli Özet ve Sözlük:** Orta kısımda raporun basit bir özeti yazar. Fare ile zor kelimelerin üzerine gelince kelimenin Türkçe anlamı küçük bir bilgi kutucuğunda (tooltip) belirir.
    * **Örümcek Haritası:** Sağ tarafta hastanın bağışıklık, enerji, metabolizma gibi durumlarını gösteren 5 köşeli bir genel "Sağlık Grafiği" bulunur.
    * **Doktora Sorulacak 3 Soru:** Hastanın doktor randevusunda sorması gereken en kritik 3 soru hazır olarak listelenir.
* **Adım 3 (Sohbet ve İndirme):** Kullanıcı sayfanın en altındaki asistanla (Chatbot) raporu hakkında yazışarak aklındaki diğer soruları sorabilir veya tüm bu güzel ekranı tek tıkla şık bir "PDF" belgesi olarak bilgisayarına indirebilir.

## 4. Yapay Zeka Arka Planda Ne İş Yapacak? (AI'ın Rolü)
* **Karakter (Agent) Rolü:** Yapay zeka düz bir robot gibi çeviri yapmaz. Rapor çocuğa aitse ebeveyni rahatlatan pedagojik bir dille, yaşlıya aitse çok saygılı ve şefkatli bir dille ("Kıymetli büyüğümüz...") konuşur.
* **Koordinat Bulucu:** Raporu okuyup hastalığın vücudun neresinde olduğunu anlar ve haritada o noktayı işaretler.
* **Rehberlik:** Hastanın hekimle rahat iletişim kurabilmesi için rapora özel 3 mantıklı soru üretir ve anlık sohbet asistanı olarak soruları yanıtlar.

## 5. Başarı Kriteri (Uygulamanın Çalıştığını Nasıl Anlarız?)
Bir kullanıcının karmaşık bir raporu sisteme yapıştırdığında; yapay zekanın seçilen kişiye (çocuk, yetişkin, yaşlı) uygun bir dille özet çıkarması, haritada doğru organı şaşırmadan işaretlemesi, 3 mantıklı soru üretmesi ve en sonunda kullanıcının tüm bu sayfayı bozulmadan tıbbi bir PDF belgesi olarak indirebilmesi.