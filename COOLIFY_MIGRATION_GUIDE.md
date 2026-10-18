# Coolify Canlıya Alma & Neon Veritabanı Geçiş Rehberi

Bu rehber, **Mosaik Dialog und Kultur e.V.** projesini **Coolify** üzerinde kendi sunucunuzdaki PostgreSQL ile canlıya alma ve mevcut **Neon veritabanındaki** tüm verileri sıfır kayıpla aktarma adımlarını içerir.

---

## 📁 Hazırlanan Dosyalar

Proje dizininde Coolify için aşağıdaki dosyalar hazırlandı:

1. **`neon_backup_mosaik.sql`**: Neon PostgreSQL'deki tüm şema (tablolar, enum tipleri, indexler, ilişkiler) ve tüm güncel verilerin (sayfalar, projeler, etkinlikler, medya kayıtları, kullanıcılar vb.) eksiksiz yedeği.
2. **`Dockerfile`**: Next.js 16 ve Payload CMS 3 için optimize edilmiş, çok aşamalı (multi-stage) Debian tabanlı Docker imajı.
3. **`docker-compose.yml`**: Hem uygulamayı (`app`) hem de PostgreSQL 16 veritabanını (`postgres`) otomatik ağ ve kalıcı disk (`volume`) ile başlatan servis tanımı.
4. **`.dockerignore`**: Gereksiz dosyaların Docker derlemesine girmesini engelleyen filtreler.
5. **`.env.example`**: Coolify üzerinde girilecek tüm ortam değişkenlerinin şablonu.

---

## 🚀 1. YÖNTEM: Coolify Docker Compose ile Tek Tıkla Canlıya Alma (Önerilen)

En pratik yöntem, Coolify üzerinde projeyi **Docker Compose** olarak eklemektir. Bu sayede uygulama ve PostgreSQL aynı iç ağda (`mosaik_network`) çalışır ve yedek dosyanız (`neon_backup_mosaik.sql`) PostgreSQL ilk kez ayağa kalkarken **otomatik olarak veritabanına aktarılır**.

### Adım 1: Coolify'da Proje Oluşturma
1. Coolify paneline giriş yapın.
2. **Projects** > **+ New Project** yolunu izleyin.
3. Ortamı seçin (Production) ve **+ New Resource** butonuna tıklayın.
4. **Docker Compose Empty** veya **Git Source** seçeneğini seçin:
   * **Source**: GitHub deponuzu (`mozaik-payload`) bağlayın.
   * **Branch**: `main`
   * **Build Pack**: `Docker Compose` seçin.

### Adım 2: Ortam Değişkenlerini (Environment Variables) Tanımlama
Coolify panelinde uygulamanın **Environment Variables** bölümüne giderek aşağıdaki değişkenleri ekleyin:

```env
NODE_ENV=production
PORT=3000
HOSTNAME=0.0.0.0
POSTGRES_USER=postgres
POSTGRES_PASSWORD=BURAYA_GUCLU_BIR_VERITABANI_SIFRESI_YAZIN
POSTGRES_DB=mosaik
DATABASE_URI=postgresql://postgres:BURAYA_GUCLU_BIR_VERITABANI_SIFRESI_YAZIN@postgres:5432/mosaik
PAYLOAD_SECRET=jNYrMbKAgyxr8LVvK2sNo12weg7XdSDp
NEXT_PUBLIC_SERVER_URL=https://alan-adiniz.de
CLOUDINARY_CLOUD_NAME=xosgweuf
CLOUDINARY_API_KEY=658575442766399
CLOUDINARY_API_SECRET=wk-HNCdiPqJPbFRs0DIGdW0bS2M
```

> **Önemli**: `DATABASE_URI` içerisindeki şifre ile `POSTGRES_PASSWORD` aynı olmalıdır. Host adı servis adı olan `postgres`'tir.

### Adım 3: Alan Adı (Domain) Ayarı
* Coolify servis ayarlarında `app` servisi için domain alanına alan adınızı yazın (Örn: `https://mosaik-ruesselsheim.de`).
* Coolify (Traefik) otomatik olarak Let's Encrypt SSL sertifikasını alacaktır.

### Adım 4: Deploy
* **Deploy** butonuna tıklayın.
* Coolify sırasıyla:
  1. PostgreSQL 16 container'ını ayağa kaldırır.
  2. `neon_backup_mosaik.sql` dosyasını otomatik içe aktarır.
  3. `Dockerfile` üzerinden Next.js + Payload CMS uygulamasını derler ve yayına alır.

---

## 🗄️ 2. YÖNTEM: Coolify Standalone PostgreSQL Kullanıyorsanız (Veri Taşıma)

Eğer Coolify'da PostgreSQL'i ayrı bir veritabanı servisi ("New Resource" > "PostgreSQL") olarak açtıysanız, Neon'daki verileri doğrudan aktarmak için 2 basit yol vardır:

### A) Sunucu Terminalinden Doğrudan Aktarım (En Hızlısı)
Sunucunuza SSH ile bağlanıp tek satırda Neon'dan kendi PostgreSQL'inize kopyalayabilirsiniz:

```bash
# Tek komutla Neon'dan Coolify PostgreSQL'e canlı aktarım:
pg_dump "postgresql://neondb_owner:npg_e9pAKwh6ifHq@ep-polished-field-ast630at-pooler.c-4.eu-central-1.aws.neon.tech/neondb?sslmode=require" | psql "postgresql://postgres:SIFRE@localhost:5432/mosaik"
```

### B) Hazırladığımız SQL Dosyasıyla Aktarım
Depoda hazır bulunan `neon_backup_mosaik.sql` dosyasını sunucuda PostgreSQL container'ına basabilirsiniz:

```bash
# 1. SQL dosyasını sunucuda PostgreSQL container'ı içine aktarma:
docker exec -i mosaik_postgres psql -U postgres -d mosaik < neon_backup_mosaik.sql
```

Bu işlem birkaç saniye içinde tüm tabloları ve 26 medyanın tamamını yeni veritabanınıza yazacaktır.

---

## 🔑 3. Admin Paneline Giriş ve Kontrol

Uygulama başarıyla ayağa kalktıktan sonra:

1. **Web Sitesi**: `https://alan-adiniz.de` adresinden anasayfa ve tüm alt sayfaların çalıştığını doğrulayın.
2. **Payload Admin Paneli**: `https://alan-adiniz.de/admin` adresine gidin.
3. Neon DB'den aktarılan mevcut kullanıcı bilgileriniz (e-posta ve şifreniz) ile doğrudan giriş yapabilirsiniz.
4. **Medya Yüklemeleri**: Görseller Cloudinary üzerinde barındırıldığı için yeni sunucuya geçtiğinizde hiçbir görsel linki kırılmaz ve eksiksiz açılmaya devam eder.

---

## 🛠️ Yararlı Komutlar ve Sorun Giderme

* **Logları İzleme**:
  ```bash
  docker logs -f mosaik_app
  docker logs -f mosaik_postgres
  ```
* **PostgreSQL İçine Bağlanma**:
  ```bash
  docker exec -it mosaik_postgres psql -U postgres -d mosaik
  ```
* **Yeniden Başlatma**:
  ```bash
  docker compose restart
  ```
