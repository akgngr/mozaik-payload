import { getPayload } from 'payload'
import config from '@payload-config'
import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URI })

async function main() {
  const payload = await getPayload({ config })

  const api = await payload.find({
    collection: 'media',
    limit: 5,
    depth: 0,
  })

  console.log('=== PAYLOAD API URL (depth 0) ===')
  api.docs.forEach((d: any) => {
    console.log(`id=${d.id} url=${d.url} cloudinaryPublicId=${d.cloudinaryPublicId}`)
  })

  console.log('\n=== RAW DB url ===')
  const res = await pool.query(
    `select id, "cloudinary_public_id" as cid, url from media where "cloudinary_public_id" is not null order by id limit 5`,
  )
  res.rows.forEach((r) => console.log(`id=${r.id} url=${r.url} cid=${r.cid}`))

  await pool.end()
}

main().catch((e) => {
  console.error('ERROR:', e)
  process.exit(1)
})
