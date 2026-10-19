import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URI })

async function run() {
  console.log('--- tables ---')
  try {
    const res = await pool.query(
      `select table_name from information_schema.tables where table_schema='public' order by table_name`,
    )
    res.rows.forEach((r) => console.log(r.table_name))
  } catch (e) {
    console.error('tables error:', (e as Error).message)
  }

  console.log('\n--- media columns ---')
  try {
    const res = await pool.query(
      `select column_name, data_type from information_schema.columns where table_name = 'media' order by ordinal_position`,
    )
    res.rows.forEach((r) => console.log(JSON.stringify(r)))
  } catch (e) {
    console.error('media columns error:', (e as Error).message)
  }

  console.log('\n--- payload_migrations ---')
  try {
    const res = await pool.query(`select * from payload_migrations order by id`)
    res.rows.forEach((r) => console.log(r.name || JSON.stringify(r)))
    if (res.rows.length === 0) console.log('(empty)')
  } catch (e) {
    console.error('payload_migrations error:', (e as Error).message)
  }

  await pool.end()
}

run()
