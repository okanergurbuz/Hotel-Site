# Deluxe Hotel · Otel Tanıtım Sitesi

Hayali bir sahil oteli için hazırlanmış, tamamen çalışan bir tanıtım sitesi. HTML, CSS ve düz JavaScript ile yazıldı; herhangi bir kütüphane veya derleme adımı gerektirmez.

> Deluxe Hotel gerçek bir otel değildir. Bu site [Okan Ergürbüz](https://okanergurbuz.github.io)'ün portföy çalışmasıdır; rezervasyon veya mesaj gönderilmez.

## Özellikler

- **Rezervasyon hesaplayıcı:** Giriş ve çıkış tarihi, misafir sayısı ve oda seçilince gece sayısını ve toplam fiyatı hesaplar. Geçmiş tarih, ters tarih ve oda kapasitesi kontrolü yapar.
- **Oda kartları:** "Book" butonu odayı rezervasyon formunda seçili hale getirir ve forma kaydırır.
- **Galeri:** Fotoğraflara tıklayınca büyük görünüm açılır; ok tuşları ve Esc ile kullanılabilir.
- **İletişim formu:** Ad, geçerli e-posta ve mesaj kontrolü yapar.
- **Blog sayfası:** Kategori filtreleri ve "Read more" ile açılan yazılar.
- **Mobil uyum:** Telefonda açılır tam ekran menü, tek sütun düzen.
- **Animasyonlar:** Açılışta yakınlaşan arka plan, kaydırınca yerine oturan bölümler. "Hareketi azalt" ayarına uyar.
- **Erişilebilirlik:** Görsellerde açıklama (alt) metinleri, klavye ile kullanılabilen menü ve galeri.

## Dosyalar

| Dosya | İçerik |
|---|---|
| `index.html` | Ana sayfa: hizmetler, hakkımızda, galeri, odalar, ekip, iletişim |
| `blogs.html` | Blog sayfası |
| `css/style.css` | Tüm tasarım. Renkler ve yazı tipleri en üstteki `:root` bloğunda |
| `js/main.js` | Menü, rezervasyon hesabı, formlar, galeri, blog filtreleri, animasyonlar |
| `img/` | Fotoğraflar |

## Oda fiyatlarını değiştirmek

Fiyatlar iki yerde durur: `index.html` içindeki oda kartlarında (`€180 / night`) ve `js/main.js` içindeki `ROOMS` listesinde. İkisini birlikte güncelle.
