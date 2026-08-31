import path from 'path'
import fs from 'fs'
import crypto from 'crypto'
import { fileURLToPath } from 'url'
import { v2 as cloudinary } from 'cloudinary'
import { getPayload } from 'payload'
import config from '../src/payload.config'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const mediaDir = path.resolve(__dirname, '../media')

const cloudName = process.env.CLOUDINARY_CLOUD_NAME
const apiKey = process.env.CLOUDINARY_API_KEY
const apiSecret = process.env.CLOUDINARY_API_SECRET

if (!cloudName || !apiKey || !apiSecret) {
  console.error(
    'Cloudinary credentials missing. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET.',
  )
  process.exit(1)
}

cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret })

const isSizeVariant = (name: string, originalName?: string | null): boolean => {
  if (!originalName) return false
  const dot = name.lastIndexOf('.')
  const base = name.slice(0, dot)
  const suffix = base.slice(0, base.lastIndexOf('-'))
  return suffix === originalName && /-\d+x\d+$/.test(base)
}

const findOriginalFile = (record: { filename?: string | null }): string | null => {
  if (!fs.existsSync(mediaDir)) return null
  const files = fs.readdirSync(mediaDir)
  if (record.filename && files.includes(record.filename)) {
    return path.join(mediaDir, record.filename)
  }
  const candidates = files.filter((f) => !isSizeVariant(f, record.filename))
  const hash = record.filename?.split('-')[0]
  if (!hash) return null
  const byHash = candidates.find((f) => f.startsWith(hash))
  return byHash ? path.join(mediaDir, byHash) : null
}

const uploadToCloudinary = (filePath: string): Promise<{ public_id: string; secure_url: string }> => {
  const publicId = crypto.randomBytes(20).toString('hex')
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      filePath,
      { folder: 'mosaik', public_id: publicId, resource_type: 'auto' },
      (error, result) => {
        if (error) reject(new Error(`Upload error: ${error.message}`))
        else resolve(result as { public_id: string; secure_url: string })
      },
    )
  })
}

const payload = await getPayload({ config })

const all = await payload.find({ collection: 'media', limit: 1000, depth: 0 })
let updated = 0
let failed = 0

for (const doc of all.docs) {
  try {
    const filePath = findOriginalFile(doc)
    if (!filePath) {
      console.warn(`[skip] No local file for media id=${doc.id} filename=${doc.filename}`)
      failed++
      continue
    }
    const result = await uploadToCloudinary(filePath)
    if (!result || !result.public_id || !result.secure_url) {
      console.warn(`[skip] Upload returned no public_id for media id=${doc.id}`)
      failed++
      continue
    }
    await payload.update({
      collection: 'media',
      id: doc.id,
      data: { cloudinaryPublicId: result.public_id, url: result.secure_url } as any,
      depth: 0,
    })
    updated++
    console.log(`[ok] media id=${doc.id} -> ${result.secure_url}`)
  } catch (err) {
    failed++
    console.error(`[error] media id=${doc.id}:`, (err as Error).message)
  }
}

console.log(`\nDone. updated=${updated} failed=${failed} total=${all.docs.length}`)
process.exit(failed > 0 ? 1 : 0)
