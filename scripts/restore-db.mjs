#!/usr/bin/env node

/**
 * =========================================================================
 * Mosaik Dialog und Kultur e.V. - Database Restore Script
 * =========================================================================
 * Bu script, .env dosyasındaki DATABASE_URI bağlantısını kullanarak
 * sunucudaki PostgreSQL veritabanına bağlanır ve neon_backup_mosaik.sql
 * dosyasındaki tüm şema ve verileri eksiksiz yükler.
 *
 * Kullanım:
 *   node scripts/restore-db.mjs
 *   node scripts/restore-db.mjs --clean    (Mevcut tabloları sıfırlayıp temiz kurulum yapar)
 *   pnpm run db:restore
 * =========================================================================
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import pg from 'pg'

const { Pool } = pg
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')

// 1. .env ve .env.local dosyalarını otomatik yükle
function loadEnv() {
  const envFiles = ['.env', '.env.local', '.env.production']
  for (const file of envFiles) {
    const fullPath = path.join(rootDir, file)
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, 'utf8')
      content.split('\n').forEach((line) => {
        const trimmed = line.trim()
        if (!trimmed || trimmed.startsWith('#')) return
        const idx = trimmed.indexOf('=')
        if (idx > -1) {
          const key = trimmed.slice(0, idx).trim()
          let val = trimmed.slice(idx + 1).trim()
          if (
            (val.startsWith('"') && val.endsWith('"')) ||
            (val.startsWith("'") && val.endsWith("'"))
          ) {
            val = val.slice(1, -1)
          }
          if (!process.env[key]) {
            process.env[key] = val
          }
        }
      })
    }
  }
}

loadEnv()

let databaseUri = process.env.DATABASE_URI

// Eğer doğrudan DATABASE_URI yoksa, POSTGRES_* ortam değişkenlerinden otomatik oluştur
if (!databaseUri && process.env.POSTGRES_DB && process.env.POSTGRES_USER && process.env.POSTGRES_PASSWORD) {
  const host = process.env.POSTGRES_HOST || 'localhost'
  const port = process.env.POSTGRES_PORT || '5432'
  databaseUri = `postgresql://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${host}:${port}/${process.env.POSTGRES_DB}`
}

if (!databaseUri) {
  console.error('\n❌ HATA: DATABASE_URI veya POSTGRES_* ortam değişkenleri bulunamadı!')
  console.error('Lütfen .env dosyanıza geçerli veritabanı bilgilerini ekleyin:')
  console.error('Örnek 1: DATABASE_URI=postgresql://postgres:sifreniz@localhost:5432/mosaik')
  console.error('Örnek 2: POSTGRES_DB=mosaik, POSTGRES_USER=postgres, POSTGRES_PASSWORD=sifreniz\n')
  process.exit(1)
}

// Güvenlik koruması: Kaynak Neon veritabanının üzerine yanlışlıkla yazılmasını önle
if (databaseUri.includes('neon.tech') && !process.argv.includes('--force')) {
  console.warn('\n⚠️  GÜVENLİK UYARISI: DATABASE_URI adresi kaynak Neon veritabanını (neon.tech) işaret ediyor!')
  console.warn('Bu script, verileri sunucudaki yeni/mevcut PostgreSQL veritabanınıza yüklemek için hazırlanmıştır.')
  console.warn('Lütfen .env dosyanızdaki DATABASE_URI adresini sunucunuzdaki PostgreSQL adresi ile güncelleyin:')
  console.warn('Örnek: DATABASE_URI=postgresql://postgres:sifreniz@localhost:5432/mosaik')
  console.warn('(Eğer yine de Neon üzerine çalıştırmak istiyorsanız --force bayrağını ekleyin: node scripts/restore-db.mjs --force)\n')
  process.exit(1)
}

// Güvenlik: Bağlantı şifresini gizleyerek ekrana yazdır
function maskConnectionString(uri) {
  try {
    const u = new URL(uri)
    const host = u.host
    const db = u.pathname.replace(/^\//, '')
    const user = u.username
    return `${user}@${host}/${db}`
  } catch {
    return '(özel bağlantı dizesi)'
  }
}

async function runRestore() {
  const isClean = process.argv.includes('--clean') || process.argv.includes('-c')

  console.log('\n======================================================')
  console.log('🚀 Mosaik PostgreSQL Veritabanı Yükleme Aracı')
  console.log('======================================================')
  console.log(`📡 Hedef Veritabanı: ${maskConnectionString(databaseUri)}`)

  // Yedek dosyasını bul
  let backupFile = path.resolve(rootDir, 'neon_backup_mosaik.sql')
  if (!fs.existsSync(backupFile)) {
    backupFile = path.resolve(__dirname, '../neon_backup_mosaik.sql')
  }

  if (!fs.existsSync(backupFile)) {
    console.error(`\n❌ HATA: Yedek dosyası bulunamadı: ${backupFile}`)
    process.exit(1)
  }

  const fileSizeKb = (fs.statSync(backupFile).size / 1024).toFixed(2)
  console.log(`📄 Yedek Dosyası: neon_backup_mosaik.sql (${fileSizeKb} KB)`)

  const pool = new Pool({
    connectionString: databaseUri,
    connectionTimeoutMillis: 10000,
  })

  let client
  try {
    console.log('⏳ Veritabanına bağlanılıyor...')
    client = await pool.connect()
    console.log('✅ Bağlantı başarılı!')

    // Mevcut tabloları kontrol et
    const existingTablesRes = await client.query(`
      SELECT count(*)::int as count 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_type = 'BASE TABLE';
    `)
    const existingTableCount = existingTablesRes.rows[0]?.count || 0

    if (existingTableCount > 0) {
      if (isClean) {
        console.log(`⚠️  --clean parametresi algılandı. Mevcut ${existingTableCount} tablo sıfırlanıyor...`)
        await client.query(`
          DROP SCHEMA public CASCADE;
          CREATE SCHEMA public;
          GRANT ALL ON SCHEMA public TO CURRENT_USER;
          GRANT ALL ON SCHEMA public TO public;
        `)
        console.log('✅ public şeması temizlendi.')
      } else {
        console.log(`ℹ️  Veritabanında zaten ${existingTableCount} tablo mevcut.`)
        console.log('💡 Not: Sıfırdan temiz bir yükleme yapmak isterseniz: node scripts/restore-db.mjs --clean')
      }
    }

    console.log('\n⏳ Yedek SQL komutları çalıştırılıyor (şema + tüm veriler)...')
    const sqlContent = fs.readFileSync(backupFile, 'utf8')

    // SQL dosyasını çalıştır
    await client.query(sqlContent)

    console.log('✅ SQL yedeği başarıyla yüklendi!')

    // Doğrulama: Tablo ve satır sayılarını ekrana bas
    console.log('\n📊 Yüklenen Verilerin Doğrulama Özeti:')
    console.log('------------------------------------------------------')
    const checkTables = [
      'users',
      'pages',
      'projects',
      'events',
      'media',
      'subscribers',
      'header',
      'footer',
      'homepage',
      'donation',
      'contact_info',
    ]

    for (const tbl of checkTables) {
      try {
        const countRes = await client.query(`SELECT count(*)::int as cnt FROM "${tbl}";`)
        const cnt = countRes.rows[0]?.cnt ?? 0
        console.log(`  ✓ ${tbl.padEnd(20)} : ${cnt} kayıt`)
      } catch {
        console.log(`  - ${tbl.padEnd(20)} : Tablo oluşturulmadı`)
      }
    }
    console.log('------------------------------------------------------')
    console.log('🎉 Kurulum ve veri aktarımı eksiksiz tamamlandı!\n')
  } catch (err) {
    console.error('\n❌ Yükleme sırasında bir hata oluştu:')
    console.error(err.message || err)
    if (err.message && err.message.includes('already exists')) {
      console.log('\n💡 İpucu: Tablolar veya tipler zaten mevcut olduğu için hata aldınız.')
      console.log('Temiz bir yeniden yükleme için şu komutu çalıştırabilirsiniz:')
      console.log('  node scripts/restore-db.mjs --clean\n')
    }
    process.exit(1)
  } finally {
    if (client) client.release()
    await pool.end()
  }
}

runRestore()
