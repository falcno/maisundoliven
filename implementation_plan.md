# Mükemmel Hediye Oyunu: Sonsuz Koşu & Hikaye

Bu plan, kız arkadaşın için hazırlayacağımız özel ve romantik pixel-art koşu oyununun teknik tasarımını ve nasıl geliştirileceğini detaylandırmaktadır. Oyun, Google Dinozor oyununun çok daha gelişmiş, renkli ve sizin hikayenizi anlatan bir versiyonu olacak.

## User Review Required

> [!IMPORTANT]
> Lütfen aşağıdaki açık soruları ve planı incele. Planı onayladığında projeyi kurmaya ve çizimleri oluşturmaya başlayacağım!

## Açık Sorular

Tasarıma başlamadan önce netleştirmemiz gereken ufak detaylar:
1. **"Melek" Detayı:** Mesajının sonunda "yukarıdan bir melek (sevg)" şeklinde yarım kalmış bir kısım var. Sanırım karakter yandığında, seni (sevgilisini) temsil eden bir meleğin yukarıdan inip onu kurtarmasını veya ekranda görünmesini istiyorsun. Doğru mu anladım?
2. **Can Sistemi:** Satın alınan her eşyanın +1 can verdiğini söyledin. Karakter bir kitaba çarptığında canı 1 azalıp koşmaya kaldığı yerden hız kesmeden devam mı etsin, yoksa öldükten sonra "2. canın kullanılıyor" gibi ufak bir dirilme animasyonu mu olsun?
3. **Müzik:** Oyuna arka plan müziği eklemek ister misin? (Şimdilik sessiz yapıp sonra da ekleyebiliriz).

## Önerilen Mimari ve Teknoloji

- **Altyapı:** Vite + React + TypeScript (Hızlı, modern ve Vercel'e tek tıkla yüklenebilir).
- **Oyun Motoru:** HTML5 Canvas API (React içinde çalışacak özel bir oyun döngüsü). Çok hafif olduğu için hem telefonda hem bilgisayarda pürüzsüz 60 FPS çalışacak.
- **Kayıt Sistemi:** Oyuncunun topladığı Trendyol kuponları ve satın aldığı eşyalar tarayıcının `localStorage` belleğine kaydedilecek. Böylece sekmeyi kapatsa bile emeği boşa gitmeyecek.
- **Tasarım:** Sadece pixel art kullanılacak. Şık, nostaljik ve sevimli bir atmosfer yaratılacak. Mobil cihazlarda dikey (portrait) veya yatay (landscape) ekranları destekleyecek responsive (duyarlı) bir Canvas alanı oluşturulacak.

## Oyunun Aşamaları ve Mekanikleri

### 1. Market (Ana Ekran)
- Oyuna ilk girişte ve her ölümden sonra bu ekran görünecek.
- Ekranda toplam "Trendyol Kuponu" bakiyesi yer alacak.
- **Satın Alınabilir Eşyalar:**
  - Şakayık Buketi (Örn: 50 Kupon) -> +1 Can
  - Bayramoğlu Döner (Örn: 100 Kupon) -> +1 Can
  - Zara Larsson Bileti (Örn: 150 Kupon) -> +1 Can
  - Mavi Suzuki Swift (Örn: 300 Kupon) -> +1 Can VE karakter artık koşmak yerine arabayla ilerler.

### 2. Koşu Modu (Game Loop)
- **Karakter:** Ekrana dokunulunca (veya boşluk tuşuna basılınca) zıplar. Mavi Suzuki alındıysa araba sprite'ı kullanılır.
- **Engeller (Ders Kitapları):** Rastgele aralıklarla yerden ve havadan gelir. Havadan gelenler için karakterin eğilmesi gerekebilir veya altından geçebilir (mekaniği basit tutmak için sadece zıplayarak geçilebilecek şekilde dizebiliriz).
- **Ödüller:** Rastgele havada/yerde beliren Trendyol Kuponları. Çarpışma anında toplanır ve kupon sayacı artar.
- **Arka Plan Değişimi (Seviyeler):** Puan/Mesafe arttıkça oyun hızlanacak ve arka plan (parallax) sırasıyla değişecek:
  1. Türk-Alman Üniversitesi Yerleşkesi
  2. TK Elevator Ofisi
  3. TU Berlin (Yüksek Lisans)
  4. Kır Düğünü (Final/Sonsuz döngü)

### 3. Ölüm ve Melek Animasyonu
- Karakterin canı 0'a düştüğünde oyun durur.
- Yukarıdan seni temsil eden bir Melek figürü süzülerek iner, "Bir dahaki sefere başarabilirsin" temalı romantik/tatlı bir mesaj gösterilir.
- Ardından oyun Market ekranına döner.

## Geliştirme Planı (Adımlar)

1. **Adım 1: Proje Kurulumu.** Vite React projesinin oluşturulması ve Vercel için ayarlanması.
2. **Adım 2: Çizimlerin (Asset) Üretilmesi.** AI kullanarak senin için özel pixel art görsellerin (TAÜ, TU Berlin, Döner, Buket, Araba vb.) üretilmesi ve projeye eklenmesi.
3. **Adım 3: Oyun Döngüsü.** Zıplama, yerçekimi ve çarpışma fiziklerinin yazılması.
4. **Adım 4: Arka Plan ve Engeller.** Seviye sistemine göre değişen arka planların ve rastgele gelen ders kitaplarının eklenmesi.
5. **Adım 5: Market Sistemi.** Kupon toplama, eşya satın alma ve araba transformasyonunun kodlanması.
6. **Adım 6: Cila ve Mobil Uyumluluk.** Dokunmatik kontrollerin test edilmesi ve tam ekran optimizasyonu.

## Doğrulama Planı
- Oyunun masaüstünde (Boşluk/Fare tıklaması) ve mobilde (Ekrana dokunma) sorunsuz zıpladığı test edilecek.
- Eşyaların doğru fiyatlandırmayla satın alınabildiği ve satın alınan eşyanın bir sonraki turda +1 can sağladığı görülecek.
- Suzuki Swift alındığında karakter görselinin değiştiği teyit edilecek.
- Puan arttıkça arka planların sorunsuz geçiş yaptığı doğrulanacak.
