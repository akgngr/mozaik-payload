import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URI })

async function main() {
  console.log('=== media mimeType + cid + url (first 10) ===')
  const res = await pool.query(
    `select id, "cloudinary_public_id" as cid, mime_type as mime, url from media where "cloudinary_public_id" is not null order by id limit 10`,
  )
  res.rows.forEach((r) => console.log(`id=${r.id} mime=${r.mime} cid=${r.cid} url=${r.url}`))

  console.log('\n=== count by mime_type ===')
  const mime = await pool.query(
    `select mime_type, count(*) from media where "cloudinary_public_id" is not null group by mime_type`,
  )
  mime.rows.forEach((r) => console.log(`${r.mime_type} => ${r.count}`))

  await pool.end()
}

main().catch((e) => {
  console.error('ERROR:', e)
  process.exit(1)
})
