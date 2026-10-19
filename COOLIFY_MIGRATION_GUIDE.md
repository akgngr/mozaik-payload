# Coolify Canlıya Alma, Yerel PostgreSQL & VPS Medya Depolama Rehberi

Bu proje, üçüncü taraf servis bağımlılıkları (Neon ve Cloudinary) tamamen kaldırılarak, **veritabanı VPS PostgreSQL'inizde, tüm medya ve resimler ise doğrudan VPS diskinizde** saklanacak şekilde optimize edilmiştir.

---

## 🖼️ VPS Üzerinde Medya (Asset) Depolama Sistemi

* **Buluttan Bağımsız (100% Self-Hosted)**: Artık Cloudinary hesabına veya API kotalarına ihtiyaç yoktur.
* **Mevcut 26 Resim & Boyutları Hazır**: Cloudinary'deki 26 orijinal görsel ve 57 adet otomatik oluşturulmuş boyut varyantı (toplam 83 dosya, 46 MB) `public/media/` klasörüne indirilmiştir ve depoya dahildir.
* **Kalıcı Docker Volume**: `docker-compose.yml` içinde `./public/media:/app/public/media` bağlantısı kurulmuştur. Yönetim panelinden yeni bir resim yüklediğinizde dosya doğrudan VPS diskinize yazılır ve container güncellense bile asla silinmez.
* **Hızlı ve Önbellekli Teslimat**: Görseller Next.js statik sunucusu üzerinden doğrudan `/media/<dosya-adi>` adresinden en yüksek hızda sunulur.

---

## ⚡ Hızlı Özet (3 Adımda Canlıya Alma)

1. **Coolify Environment Variables** bölümüne değişkenlerinizi tanımlayın:
   - `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD`
   - `PAYLOAD_SECRET`, `NEXT_PUBLIC_SERVER_URL`
2. **Coolify'da Deploy Edin**:
   - `docker-compose.yml` dosyasında `app` ve `db` (Postgres 16 + `mosaik_postgres_data` volume) tanımlıdır.
   - Build sırasında veritabanı bağlantısı gerekmez; Next.js derlemesi hatasız tamamlanır.
3. **Yedeği Veritabanına Yükleyin**:
   - `docker exec -it mosaik_app pnpm run db:restore`
   *(Tüm şema ve 26 medya kaydı yerel `/media/...` yollarıyla birlikte veritabanınıza yazılır).*

---

## 🛠️ 1. ADIM: .env / Coolify Değişkenlerini Tanımlama

Coolify arayüzündeki **Environment Variables** bölümüne şu değişkenleri girin:

```env
# 1. PostgreSQL Bilgileri
POSTGRES_DB=mosaik
POSTGRES_USER=postgres
POSTGRES_PASSWORD=guclu_sifreniz

# 2. Opsiyonel: Özel bağlantı dizesi (Eğer boş bırakılırsa compose otomatik oluşturur)
DATABASE_URI=postgresql://postgres:guclu_sifreniz@db:5432/mosaik

# 3. Payload CMS Güvenlik Anahtarı (Min 32 karakter)
PAYLOAD_SECRET=jNYrMbKAgyxr8LVvK2sNo12weg7XdSDp

# 4. Canlı Domain Adresiniz
NEXT_PUBLIC_SERVER_URL=https://mosaik-ruesselsheim.de

# 5. Docker Ağı & Port
DOCKER_NETWORK=coolify
PORT=3000
```

> **Not:** Cloudinary değişkenleri artık gerekli değildir! Resimler doğrudan VPS üzerindeki `./public/media` dizininde depolanır.

---

## 🐳 2. ADIM: Coolify'da Projeyi Deploy Etme

1. **Coolify Paneli** > Projenizi açın.
2. **Build Pack**: **Docker Compose** olarak ayarlı olduğundan emin olun.
3. **Deploy** butonuna tıklayın.
4. Coolify hem PostgreSQL (`db` servisi) hem de Next.js/Payload (`app` servisi) container'larını aynı stack ve `coolify` ağı üzerinde ayağa kaldıracaktır.

---

## 📥 3. ADIM: Veritabanı Yedeğini Yükleme

Container'lar ayağa kalktıktan sonra yedek dosyasını (`neon_backup_mosaik.sql`) veritabanına aktarmak için 2 kolay yöntemden birini kullanabilirsiniz:

### Yöntem A (En Pratik - App Container İçinden):
```bash
docker exec -it mosaik_app pnpm run db:restore
```

### Yöntem B (VPS Terminalinden Doğrudan SQL Aktarımı):
```bash
docker compose exec -T db psql -U postgres -d mosaik < neon_backup_mosaik.sql
```

### Script Neler Yapar?
* `.env` dosyasındaki veya `POSTGRES_*` değişkenleriyle belirtilen veritabanına bağlanır.
* `neon_backup_mosaik.sql` dosyasındaki tüm DDL şemasını (tablolar, enum tipleri, indexler) oluşturur.
* Neon'daki tüm verileri aktarır. Tüm medya adresleri `/media/<resim-adi>` olarak ayarlanmıştır.
* İşlem bitince doğrulama tablosu basar:

```text
======================================================
🚀 Mosaik PostgreSQL Veritabanı Yükleme Aracı
======================================================
📡 Hedef Veritabanı: postgres@db:5432/mosaik
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
