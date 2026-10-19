import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URI })
const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || ''

function toCloudinaryUrl(cid: string, mime: string): string {
  const resourceType = mime.startsWith('image/') ? 'image' : 'raw'
  return `https://res.cloudinary.com/${CLOUD_NAME}/${resourceType}/upload/${cid}`
}

async function main() {
  const rows = await pool.query(
    `select id, "cloudinary_public_id" as cid, mime_type as mime from media where "cloudinary_public_id" is not null order by id`,
  )
  console.log(`updating ${rows.rows.length} rows`)

  for (const r of rows.rows) {
    const newUrl = toCloudinaryUrl(r.cid, r.mime)
    await pool.query(`update media set url = $1 where id = $2`, [newUrl, r.id])
    console.log(`id=${r.id} -> ${newUrl}`)
  }

  console.log('\n=== verify ===')
  const check = await pool.query(
    `select id, url from media where "cloudinary_public_id" is not null order by id limit 6`,
  )
  check.rows.forEach((r) => console.log(`id=${r.id} url=${r.url}`))

  await pool.end()
}

main().catch((e) => {
  console.error('ERROR:', e)
  process.exit(1)
})
