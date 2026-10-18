# Coolify Canlıya Alma & Mevcut PostgreSQL Veritabanı Yükleme Rehberi

Sisteminizde halihazırda çalışan bir PostgreSQL bulunduğu için yeni bir veritabanı container'ı açmaya gerek kalmadan, aynı Docker ağı üzerinden bağlantı kuracak şekilde sistem optimize edilmiştir.

Bu rehber, `.env` dosyanıza veritabanı bilgilerinizi girdikten sonra **tek bir script çalıştırarak** tüm Neon veritabanı yedeğini mevcut PostgreSQL'inize nasıl yükleyeceğinizi ve projeyi Coolify'da nasıl yayına alacağınızı açıklar.

---

## ⚡ Hızlı Özet (3 Adımda Canlıya Alma)

1. **`.env` dosyanıza** mevcut PostgreSQL bağlantınızı (`DATABASE_URI`) yazın.
2. **Kurulum/Yükleme scriptini çalıştırın**: `pnpm run db:restore`  
   *(Tüm 26 tablo ve içerikleri mevcut PostgreSQL'inize sıfır hatayla yüklenir).*
3. **Coolify'da deploy edin**. Uygulama mevcut PostgreSQL ile aynı Docker ağında (`coolify`) çalışacaktır.

---

## 🛠️ 1. ADIM: .env Dosyasını Hazırlama

Sunucunuzda proje klasöründeki `.env` (veya Coolify arayüzündeki Environment Variables) bölümüne mevcut PostgreSQL bilgilerinizi girin:

```env
# 1. Mevcut PostgreSQL Bağlantı Adresiniz
# Eğer PostgreSQL aynı Coolify docker ağındaysa, container adını yazabilirsiniz:
DATABASE_URI=postgresql://kullanici_adiniz:sifreniz@postgres_container_adi:5432/mosaik

# (Eğer sunucunun ana işletim sisteminde localhost olarak çalışıyorsa:
# DATABASE_URI=postgresql://kullanici_adiniz:sifreniz@host.docker.internal:5432/mosaik )

# 2. Payload CMS Güvenlik Anahtarı
PAYLOAD_SECRET=jNYrMbKAgyxr8LVvK2sNo12weg7XdSDp

# 3. Canlı Domain Adresiniz
NEXT_PUBLIC_SERVER_URL=https://mosaik-ruesselsheim.de

# 4. Cloudinary (Medyalar için aynen korunuyor)
CLOUDINARY_CLOUD_NAME=xosgweuf
CLOUDINARY_API_KEY=658575442766399
CLOUDINARY_API_SECRET=wk-HNCdiPqJPbFRs0DIGdW0bS2M

# 5. Coolify Docker Ağı
DOCKER_NETWORK=coolify
PORT=3000
```

> **İpucu:** Eğer PostgreSQL'inizde henüz `mosaik` veritabanı açılmadıysa, PostgreSQL içinde `CREATE DATABASE mosaik;` komutuyla veritabanını oluşturmanız yeterlidir.

---

## 📥 2. ADIM: Yedeği Otomatik Yükleme Scripti (`db:restore`)

`.env` dosyanızı kaydettikten sonra yedeği sunucudaki PostgreSQL'e aktarmak için hazırladığımız scripti çalıştırın:

### Sunucu Terminalinde (Doğrudan Node/pnpm ile):
```bash
pnpm run db:restore
```
*(veya `node scripts/restore-db.mjs`)*

### Veya Coolify Container'ı İçinde:
Eğer uygulamayı Coolify'da ilk kez ayağa kaldırdıysanız, Coolify container konsolundan veya sunucudan:
```bash
docker exec -it mosaik_app pnpm run db:restore
```

### Script Neler Yapar?
* `.env` dosyasındaki `DATABASE_URI` adresine otomatik bağlanır.
* `neon_backup_mosaik.sql` dosyasındaki tüm DDL şemasını (tablolar, enum tipleri, indexler, ilişkiler) oluşturur.
* Neon'daki tüm verileri (sayfalar, projeler, etkinlikler, Cloudinary medya kayıtları, kullanıcılar vb.) aktarır.
* Otomatik artan ID sayaçlarını (`sequence`) günceller.
* Yükleme bitince ekrana bir doğrulama tablosu basarak kaç adet kullanıcının, sayfanın, projenin yüklendiğini raporlar:

```text
======================================================
🚀 Mosaik PostgreSQL Veritabanı Yükleme Aracı
======================================================
📡 Hedef Veritabanı: postgres@localhost:5432/mosaik
📄 Yedek Dosyası: neon_backup_mosaik.sql (151 KB)
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

> **İpucu:** Eğer daha önce deneme yapıp tabloları sıfırlayarak temiz bir kurulum yapmak isterseniz `--clean` bayrağını ekleyebilirsiniz:
> ```bash
> pnpm run db:restore --clean
> ```

---

## 🐳 3. ADIM: Coolify'da Projeyi Başlatma

1. **Coolify Paneli** > **New Resource** > **Git Source (GitHub)**.
2. Deponuzu (`mozaik-payload`) seçin.
3. **Build Pack**:
   * **Dockerfile** veya **Docker Compose** seçebilirsiniz.
   * `docker-compose.yml` dosyamız sistemdeki mevcut `coolify` ağına otomatik bağlanacak (`external: true`) şekilde optimize edilmiştir.
4. **Environment Variables**: Yukarıdaki `.env` değişkenlerini Coolify arayüzüne yapıştırın.
5. **Domain**: Domain kutucuğuna alan adınızı yazın (`https://mosaik-ruesselsheim.de`).
6. **Deploy**: Deploy butonuna tıklayın.

Uygulamanız canlıya çıkacak, mevcut PostgreSQL'inize iç ağdan erişecek ve Payload Admin paneli (`https://mosaik-ruesselsheim.de/admin`) aktif olacaktır!
