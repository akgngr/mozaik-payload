# SEO / GEO Eksik Veriler Listesi

Bu liste, Spindora SEO + GEO analizinden kalan ve **gerçek veri gerektiren** maddeleri içerir.
Bu veriler uydurulamaz; elinize ulaştığında buraya ekleyip ilgili kod değişikliklerini yapacağız.

## 1. Yazar / Kimlik (GEO [13], [18])
- [ ] Sayfada görünecek gerçek yazar adı (ör. kurucu / başkan / ekip üyesi)
- [ ] `article:author` meta etiketi + JSON-LD `Person` şeması eklenecek
- [ ] Sayfada "Yazan: ..." satırı

## 2. Yayın / Güncelleme Tarihi (GEO [14], [15])
- [ ] Anasayfa için gerçek "yayınlandı" tarihi (`datePublished`)
- [ ] Anasayfa için gerçek "son güncelleme" tarihi (`dateModified`)
- [ ] `article:published_time` / `article:modified_time` meta etiketleri

## 3. Somut Rakam / İstatistik (GEO [11])
- [ ] Gönüllü sayısı
- [ ] Kursiyer / katılımcı sayısı
- [ ] Temsil edilen ülke sayısı
- [ ] Kuruluştan (2015) beri toplam katılımcı
- [ ] Varsa diğer gerçek istatistikler

## 4. Karşılaştırma Tablosu (GEO [9])
- [ ] Karşılaştırılabilir bilgi varsa tablo (ör. aktivite / üyelik / program karşılaştırması)

## 5. Video / Modern Görsel (Teknik [16])
- [ ] Gerçek bir YouTube / Vimeo video linki (iframe olarak gömülecek)
- [ ] WebP / AVIF görsel kaynağı (responsive `<picture><source>`)

## 6. İçerik Derinliği (GEO [3])
- [ ] Anasayfa kelime sayısı ~695 → 800+ hedefi (gerçek CMS içeriğiyle genişletilecek)

---

## Not
- Yukarıdaki maddelerin hiçbiri **uydurulmadı**; hepsi gerçek veri bekliyor.
- Veriler elinize ulaştığında bu dosyayı güncelleyip ilgili kod değişikliklerini yapacağım.
