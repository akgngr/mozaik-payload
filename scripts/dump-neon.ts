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

async function dump() {
  console.log('Connecting to Neon DB...')
  const client = await pool.connect()

  try {
    const tableRes = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
        AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `)
    const tables = tableRes.rows.map((r) => r.table_name)
    console.log(`Found ${tables.length} tables:`, tables.join(', '))

    let sqlDump = `-- ========================================================\n`
    sqlDump += `-- Mosaik Dialog und Kultur e.V. - Neon Database Dump\n`
    sqlDump += `-- Generated: ${new Date().toISOString()}\n`
    sqlDump += `-- Source: Neon Postgres -> Target: Coolify PostgreSQL\n`
    sqlDump += `-- ========================================================\n\n`
    sqlDump += `SET statement_timeout = 0;\n`
    sqlDump += `SET lock_timeout = 0;\n`
    sqlDump += `SET client_encoding = 'UTF8';\n`
    sqlDump += `SET standard_conforming_strings = on;\n`
    sqlDump += `SET check_function_bodies = false;\n`
    sqlDump += `SET client_min_messages = warning;\n`
    sqlDump += `SET row_security = off;\n\n`

    // Dump tables data
    for (const table of tables) {
      console.log(`Dumping table: ${table}...`)
      const rowsRes = await client.query(`SELECT * FROM "${table}";`)
      const rows = rowsRes.rows

      sqlDump += `\n--\n-- Data for table "${table}" (${rows.length} rows)\n--\n`
      if (rows.length > 0) {
        const columns = Object.keys(rows[0])
        const colNames = columns.map((c) => `"${c}"`).join(', ')

        for (const row of rows) {
          const values = columns.map((col) => escapeSqlValue(row[col])).join(', ')
          sqlDump += `INSERT INTO "${table}" (${colNames}) VALUES (${values}) ON CONFLICT DO NOTHING;\n`
        }
      }
    }

    // Reset sequences for auto-increment ids
    sqlDump += `\n--\n-- Reset sequences to highest id\n--\n`
    for (const table of tables) {
      sqlDump += `DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = '${table}' AND column_name = 'id') THEN
    PERFORM setval(pg_get_serial_sequence('"${table}"', 'id'), COALESCE((SELECT MAX(id) FROM "${table}"), 1), true);
  END IF;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;\n`
    }

    const outputPath = path.resolve(process.cwd(), 'neon_backup_mosaik.sql')
    fs.writeFileSync(outputPath, sqlDump, 'utf8')
    console.log(`\nDump successfully written to: ${outputPath}`)
    console.log(`File size: ${(fs.statSync(outputPath).size / 1024).toFixed(2)} KB`)
  } finally {
    client.release()
    await pool.end()
  }
}

dump().catch((err) => {
  console.error('Dump failed:', err)
  process.exit(1)
})
