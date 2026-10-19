# Coolify Canlıya Alma, Harici PostgreSQL & VPS Medya Depolama Rehberi

Uygulama Coolify üzerinde çalışır ve veritabanı Coolify'da ayrı olarak yönetilen PostgreSQL kaynağına bağlanır. Medya dosyaları VPS diskinde saklanır.

---

## 🖼️ VPS Üzerinde Medya Depolama

* Görseller `public/media/` klasöründe tutulur.
* `docker-compose.yml`, bu dizini `/app/public/media` konumuna bağlar; uygulama yeniden dağıtıldığında yüklenen dosyalar korunur.
* Görseller `/media/<dosya-adi>` adresinden sunulur.

---

## ⚡ Hızlı Kurulum

1. Coolify'da ayrı PostgreSQL kaynağını oluşturun veya mevcut kaynağı kullanın.
2. Uygulama ve PostgreSQL container'larının ortak bir Docker ağına bağlı olduğundan emin olun.
3. Uygulamanın Coolify Environment Variables bölümünde PostgreSQL bağlantı parçalarını, `PAYLOAD_SECRET` ve `NEXT_PUBLIC_SERVER_URL` değişkenlerini tanımlayın.
4. Uygulamayı deploy edin. Compose dosyası yalnızca uygulamayı başlatır; PostgreSQL container'ı oluşturmaz.
5. Gerekliyse veritabanı yedeğini [uygulama container'ından](#-veritabanı-yedeğini-yükleme) yükleyin.

## 🛠️ Coolify Değişkenleri

`DATABASE_URI` Compose tarafından aşağıdaki PostgreSQL değişkenlerinden oluşturulur. Coolify'da bu değerleri tanımlayın:

```env
POSTGRES_HOST=postgres-hostname
POSTGRES_PORT=5432
POSTGRES_DB=mosaik
POSTGRES_USER=postgres
POSTGRES_PASSWORD=secret
PAYLOAD_SECRET=minimum_32_karakterlik_gizli_deger
NEXT_PUBLIC_SERVER_URL=https://mosaik-ruesselsheim.de
DOCKER_NETWORK=coolify
PORT=3000
```

`DATABASE_URI`, `postgresql://USER:PASSWORD@HOST:PORT/DATABASE` biçiminde birleştirilir; `POSTGRES_PORT` verilmezse `5432` kullanılır. `POSTGRES_HOST`, uygulama container'ından çözümlenebilir olmalıdır. Parolada `@`, `:`, `/` gibi URI özel karakterleri varsa `POSTGRES_PASSWORD` değerinde URL-encode edin. `DOCKER_NETWORK` değerini hem uygulamanın hem de PostgreSQL kaynağının bağlı olduğu gerçek Docker ağıyla eşleştirin.

## 🐳 Coolify'da Deploy

1. Projenin **Build Pack** ayarının **Docker Compose** olduğundan emin olun.
2. PostgreSQL kaynağının uygulamayla ortak Docker ağına bağlı olduğunu doğrulayın.
3. `POSTGRES_HOST`, `POSTGRES_PORT`, `POSTGRES_DB`, `POSTGRES_USER` ve `POSTGRES_PASSWORD` değerlerinin PostgreSQL kaynağıyla eşleştiğini kontrol edin.
4. **Deploy** butonuna tıklayın.

> Daha önce Compose içindeki PostgreSQL servisini kullandıysanız, eski veriler harici Coolify PostgreSQL'e otomatik taşınmaz. Eski `mosaik_postgres_data` volume'u bu değişiklikle silinmez; geçişten önce verilerinizi yedekleyip hedef veritabanına aktarın.

## 📥 Veritabanı Yedeğini Yükleme

Container'lar çalıştıktan sonra yedeği uygulamanın `DATABASE_URI` bağlantısına yükleyin:

```bash
docker exec -it mosaik_app pnpm run db:restore
```

Alternatif olarak, VPS terminalinden Coolify PostgreSQL container'ına aktarabilirsiniz:

```bash
docker exec -i <POSTGRES_CONTAINER_NAME> psql -U <POSTGRES_USER> -d <POSTGRES_DB> < neon_backup_mosaik.sql
```

`--clean` seçeneği mevcut `public` şemasını silip yeniden oluşturur. Yalnızca doğru hedef veritabanını seçtiğinizi doğruladıktan sonra kullanın.

Yükleme aracı `DATABASE_URI` ile bağlanır, `neon_backup_mosaik.sql` içindeki şema ve verileri yükler ve işlem sonunda tablo kayıt sayılarını gösterir.
