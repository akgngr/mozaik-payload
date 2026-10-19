# Coolify Canlıya Alma, Yerel PostgreSQL & VPS Medya Depolama Rehberi

Bu proje, üçüncü taraf servis bağımlılıkları (Neon ve Cloudinary) tamamen kaldırılarak, **veritabanı mevcut PostgreSQL'inizde, tüm medya ve resimler ise doğrudan VPS diskinizde** saklanacak şekilde optimize edilmiştir.

---

## 🖼️ VPS Üzerinde Medya (Asset) Depolama Sistemi

* **Buluttan Bağımsız (100% Self-Hosted)**: Artık Cloudinary hesabına veya API kotalarına ihtiyaç yoktur.
* **Mevcut 26 Resim & Boyutları Hazır**: Cloudinary'deki 26 orijinal görsel ve 57 adet otomatik oluşturulmuş boyut varyantı (toplam 83 dosya, 46 MB) `public/media/` klasörüne indirilmiştir ve depoya dahildir.
* **Kalıcı Docker Volume**: `docker-compose.yml` içinde `./public/media:/app/public/media` bağlantısı kurulmuştur. Yönetim panelinden yeni bir resim yüklediğinizde dosya doğrudan VPS diskinize yazılır ve container güncellense bile asla silinmez.
* **Hızlı ve Önbellekli Teslimat**: Görseller Next.js statik sunucusu üzerinden doğrudan `/media/<dosya-adi>` adresinden en yüksek hızda sunulur.

---

## ⚡ Hızlı Özet (3 Adımda Canlıya Alma)

1. **`.env` dosyanıza** mevcut PostgreSQL bağlantınızı (`DATABASE_URI`) yazın.
2. **Yedek Yükleme Scriptini Çalıştırın**:
   ```bash
   pnpm run db:restore
   ```
   *(Tüm şema ve 26 medya kaydı yerel `/media/...` yollarıyla birlikte veritabanınıza yazılır).*
3. **Coolify'da deploy edin**. Uygulama mevcut PostgreSQL ile aynı Docker ağında (`coolify`) çalışır ve resimleri yerel diskten sunar.

---

## 🛠️ 1. ADIM: .env Dosyasını Hazırlama

Sunucunuzda proje klasöründeki `.env` (veya Coolify arayüzündeki Environment Variables) bölümüne değişkenlerinizi tanımlayın:

```env
# 1. Mevcut PostgreSQL Bağlantı Adresiniz
# Eğer PostgreSQL aynı Coolify docker ağındaysa:
DATABASE_URI=postgresql://postgres_kullanicisi:sifreniz@postgres_container_adi:5432/mosaik

# (Eğer sunucunun ana işletim sisteminde localhost olarak çalışıyorsa:
# DATABASE_URI=postgresql://postgres_kullanicisi:sifreniz@host.docker.internal:5432/mosaik )

# 2. Payload CMS Güvenlik Anahtarı (Min 32 karakter)
PAYLOAD_SECRET=jNYrMbKAgyxr8LVvK2sNo12weg7XdSDp

# 3. Canlı Domain Adresiniz
NEXT_PUBLIC_SERVER_URL=https://mosaik-ruesselsheim.de

# 4. Coolify Docker Ağı
DOCKER_NETWORK=coolify
PORT=3000
```

> **Not:** Cloudinary değişkenleri artık gerekli değildir! Resimler doğrudan VPS üzerindeki `./public/media` dizininde depolanır.

---

## 📥 2. ADIM: Veritabanını Yükleme (`db:restore`)

`.env` dosyanızı kaydettikten sonra yedeği sunucudaki PostgreSQL'e aktarmak için terminalden çalıştırın:

```bash
pnpm run db:restore
```
*(veya doğrudan `node scripts/restore-db.mjs`)*

Eğer uygulamayı Coolify container'ı olarak ilk kez başlattıysanız, container konsolundan da çalıştırabilirsiniz:
```bash
docker exec -it mosaik_app pnpm run db:restore
```

### Script Neler Yapar?
* `.env` dosyasındaki `DATABASE_URI` adresine bağlanır.
* `neon_backup_mosaik.sql` dosyasındaki tüm DDL şemasını (tablolar, enum tipleri, indexler) oluşturur.
* Neon'daki tüm verileri aktarır. Tüm medya adresleri `/media/<resim-adi>` olarak ayarlanmıştır.
* İşlem bitince doğrulama tablosu basar:

```text
======================================================
🚀 Mosaik PostgreSQL Veritabanı Yükleme Aracı
======================================================
📡 Hedef Veritabanı: postgres@postgres_container:5432/mosaik
📄 Yedek Dosyası: neon_backup_mosaik.sql (148 KB)
⏳ Veritabanına bağlanılıyor...
✅ Bağlantı başarılı!
⏳ Yedek SQL komutları çalıştırılıyor (şema + tüm veriler)...
✅ SQL yedeği başarıyla yüklendi!

📊 Yüklenen Verilerin Doğrulama Özeti:
------------------------------------------------------
  ✓ users                : 1 kayıt
  ✓ pages                : 7 kayıt
  ✓ projects             : 9 kayıt
  ✓ events               : 5 kayıt
  ✓ media                : 26 kayıt
  ✓ subscribers          : 0 kayıt
  ✓ header               : 1 kayıt
  ✓ footer               : 1 kayıt
  ✓ homepage             : 1 kayıt
  ✓ donation             : 1 kayıt
  ✓ contact_info         : 1 kayıt
------------------------------------------------------
🎉 Kurulum ve veri aktarımı eksiksiz tamamlandı!
```

---

## 🐳 3. ADIM: Coolify'da Projeyi Başlatma

1. **Coolify Paneli** > **New Resource** > **Git Source (GitHub)**.
2. Deponuzu (`mozaik-payload`) seçin.
3. **Build Pack**: **Docker Compose** seçin.
4. **Environment Variables**: Yukarıdaki `.env` değişkenlerini Coolify paneline yapıştırın.
5. **Domain**: Alan adınızı yazın (`https://mosaik-ruesselsheim.de`).
6. **Deploy**: Butona tıklayın.

Uygulamanız canlıya çıkacak, mevcut PostgreSQL'inize iç ağdan erişecek ve tüm resimler VPS'inizin kendi diskinden hızlıca yüklenecektir!
