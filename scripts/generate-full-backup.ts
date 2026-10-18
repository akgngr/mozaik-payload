import { Pool } from 'pg'
import fs from 'fs'
import path from 'path'

const connectionString =
  process.env.DATABASE_URI ||
  'postgresql://neondb_owner:npg_e9pAKwh6ifHq@ep-polished-field-ast630at-pooler.c-4.eu-central-1.aws.neon.tech/neondb?sslmode=require'

const pool = new Pool({ connectionString })

function escapeSqlValue(val: unknown): string {
  if (val === null || val === undefined) return 'NULL'
  if (typeof val === 'boolean') return val ? 'TRUE' : 'FALSE'
  if (typeof val === 'number') return String(val)
  if (val instanceof Date) return `'${val.toISOString()}'`
  if (typeof val === 'object') {
    return `'${JSON.stringify(val).replace(/'/g, "''")}'::jsonb`
  }
  return `'${String(val).replace(/'/g, "''")}'`
}

async function run() {
  console.log('Generating complete self-contained SQL dump...')
  const client = await pool.connect()

  try {
    // Read DDL from migration files
    const mig1File = fs.readFileSync(
      path.resolve(process.cwd(), 'src/migrations/20260712_195239.ts'),
      'utf8',
    )
    const mig2File = fs.readFileSync(
      path.resolve(process.cwd(), 'src/migrations/20260828_143656.ts'),
      'utf8',
    )
    const mig3File = fs.readFileSync(
      path.resolve(process.cwd(), 'src/migrations/20260830_193325.ts'),
      'utf8',
    )

    // Extract SQL inside sql` ... `
    const extractSql = (content: string) => {
      const match = content.match(/sql`([\s\S]*?)`\)/)
      return match ? match[1].trim() : ''
    }

    const ddl1 = extractSql(mig1File)
    const ddl2 = extractSql(mig2File)
    const ddl3 = extractSql(mig3File)

    let sqlDump = `-- =========================================================================\n`
    sqlDump += `-- Mosaik Dialog und Kultur e.V. - Complete Self-Contained Database Backup\n`
    sqlDump += `-- Date: ${new Date().toISOString()}\n`
    sqlDump += `-- Target: Coolify Self-Hosted PostgreSQL 15/16\n`
    sqlDump += `-- Contains: Full Schema DDL (Types, Tables, Indexes, FKs) + All Data Rows\n`
    sqlDump += `-- =========================================================================\n\n`
    sqlDump += `SET statement_timeout = 0;\n`
    sqlDump += `SET lock_timeout = 0;\n`
    sqlDump += `SET client_encoding = 'UTF8';\n`
    sqlDump += `SET standard_conforming_strings = on;\n`
    sqlDump += `SET check_function_bodies = false;\n`
    sqlDump += `SET client_min_messages = warning;\n`
    sqlDump += `SET row_security = off;\n\n`

    sqlDump += `-- =========================================================================\n`
    sqlDump += `-- STEP 1: SCHEMA CREATION (DDL)\n`
    sqlDump += `-- =========================================================================\n\n`
    sqlDump += ddl1 + '\n\n'
    sqlDump += ddl2 + '\n\n'
    sqlDump += ddl3 + '\n\n'

    sqlDump += `-- =========================================================================\n`
    sqlDump += `-- STEP 2: DATA INSERTION\n`
    sqlDump += `-- =========================================================================\n\n`

    // Tables in insertion order (respecting foreign keys)
    const tableOrder = [
      'payload_migrations',
      'users',
      'users_sessions',
      'media',
      'pages',
      'projects',
      'projects_gallery',
      'events',
      'subscribers',
      'header',
      'header_nav_items',
      'footer',
      'footer_links',
      'footer_social_links',
      'site_settings',
      'homepage',
      'homepage_hero_images',
      'homepage_highlight_cards',
      'donation',
      'donation_impact_cards',
      'contact_info',
      'payload_locked_documents',
      'payload_locked_documents_rels',
      'payload_preferences',
      'payload_preferences_rels',
      'payload_kv',
    ]

    for (const table of tableOrder) {
      console.log(`Dumping table: ${table}...`)
      const rowsRes = await client.query(`SELECT * FROM "${table}";`)
      const rows = rowsRes.rows

      sqlDump += `\n-- Data for "${table}" (${rows.length} rows)\n`
      if (rows.length > 0) {
        const columns = Object.keys(rows[0])
        const colNames = columns.map((c) => `"${c}"`).join(', ')

        for (const row of rows) {
          const values = columns.map((col) => escapeSqlValue(row[col])).join(', ')
          sqlDump += `INSERT INTO "${table}" (${colNames}) VALUES (${values}) ON CONFLICT DO NOTHING;\n`
        }
      }
    }

    sqlDump += `\n-- =========================================================================\n`
    sqlDump += `-- STEP 3: RESET SEQUENCES TO MAX ID\n`
    sqlDump += `-- =========================================================================\n\n`
    for (const table of tableOrder) {
      sqlDump += `DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = '${table}' AND column_name = 'id') THEN
    PERFORM setval(pg_get_serial_sequence('"${table}"', 'id'), COALESCE((SELECT MAX(id) FROM "${table}"), 1), true);
  END IF;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;\n`
    }

    const outPath = path.resolve(process.cwd(), 'neon_backup_mosaik.sql')
    fs.writeFileSync(outPath, sqlDump, 'utf8')
    console.log(`\nSuccessfully created complete backup: ${outPath}`)
    console.log(`Size: ${(fs.statSync(outPath).size / 1024).toFixed(2)} KB`)
  } finally {
    client.release()
    await pool.end()
  }
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
