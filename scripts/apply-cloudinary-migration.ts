import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URI })

async function run() {
  console.log('--- adding cloudinary_public_id column if missing ---')
  try {
    await pool.query(`ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "cloudinary_public_id" varchar;`)
    console.log('column cloudinary_public_id ensured')
  } catch (e) {
    console.error('add column error:', (e as Error).message)
  }

  console.log('\n--- syncing payload_migrations ---')
  try {
    const migrations = [
      '20260712_195239',
      '20260828_143656',
      '20260830_193325',
      'dev',
    ]
    for (const name of migrations) {
      const exists = await pool.query(`select id from payload_migrations where name = $1`, [name])
      if (exists.rows.length === 0) {
        await pool.query(`insert into payload_migrations (name, batch, updated_at, created_at) values ($1, 1, now(), now())`, [name])
        console.log(`inserted migration ${name}`)
      } else {
        console.log(`migration ${name} already present`)
      }
    }
  } catch (e) {
    console.error('migrations sync error:', (e as Error).message)
  }

  await pool.end()
}

run()
