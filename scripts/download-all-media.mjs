import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import https from 'https'
import sharp from 'sharp'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')
const mediaDir = path.resolve(rootDir, 'public/media')

if (!fs.existsSync(mediaDir)) {
  fs.mkdirSync(mediaDir, { recursive: true })
}

function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return downloadFile(res.headers.location, destPath).then(resolve).catch(reject)
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed to download ${url}: status ${res.statusCode}`))
      }
      const stream = fs.createWriteStream(destPath)
      res.pipe(stream)
      stream.on('finish', () => {
        stream.close(() => resolve())
      })
      stream.on('error', reject)
    }).on('error', reject)
  })
}

async function main() {
  console.log('Extracting media items from neon_backup_mosaik.sql...')
  const backupPath = path.resolve(rootDir, 'neon_backup_mosaik.sql')
  const content = fs.readFileSync(backupPath, 'utf8')

  const mediaLines = content.match(/INSERT INTO "media" [^\n]+/g) || []
  console.log(`Found ${mediaLines.length} media records.`)

  for (let i = 0; i < mediaLines.length; i++) {
    const line = mediaLines[i]
    // Extract url: https://res.cloudinary.com/...
    const urlMatch = line.match(/'(https:\/\/res\.cloudinary\.com\/[^']+)'/)
    const fnMatch = line.match(/'([a-zA-Z0-9_\-\.]+\.(jpg|png|jpeg|webp))'/)

    if (!urlMatch || !fnMatch) {
      console.warn(`Could not parse line ${i + 1}`)
      continue
    }

    const url = urlMatch[1]
    const filename = fnMatch[1]
    const dest = path.resolve(mediaDir, filename)

    console.log(`[${i + 1}/${mediaLines.length}] Downloading ${filename}...`)
    try {
      await downloadFile(url, dest)
      console.log(`  ✓ Saved ${filename}`)

      // Check if sizes exist and generate them using sharp
      const thumbFnMatch = line.match(/'([a-zA-Z0-9_\-\.]+-400x300\.(jpg|png|jpeg|webp))'/)
      const cardFnMatch = line.match(/'([a-zA-Z0-9_\-\.]+-768x576\.(jpg|png|jpeg|webp))'/)
      const heroFnMatch = line.match(/'([a-zA-Z0-9_\-\.]+-1920x1080\.(jpg|png|jpeg|webp))'/)

      if (thumbFnMatch) {
        const thumbDest = path.resolve(mediaDir, thumbFnMatch[1])
        if (!fs.existsSync(thumbDest)) {
          await sharp(dest).resize(400, 300, { fit: 'cover' }).toFile(thumbDest)
          console.log(`    ✓ Generated thumbnail: ${thumbFnMatch[1]}`)
        }
      }

      if (cardFnMatch) {
        const cardDest = path.resolve(mediaDir, cardFnMatch[1])
        if (!fs.existsSync(cardDest)) {
          await sharp(dest).resize(768, 576, { fit: 'cover' }).toFile(cardDest)
          console.log(`    ✓ Generated card: ${cardFnMatch[1]}`)
        }
      }

      if (heroFnMatch) {
        const heroDest = path.resolve(mediaDir, heroFnMatch[1])
        if (!fs.existsSync(heroDest)) {
          await sharp(dest).resize(1920, 1080, { fit: 'cover' }).toFile(heroDest)
          console.log(`    ✓ Generated hero: ${heroFnMatch[1]}`)
        }
      }
    } catch (err) {
      console.error(`  ❌ Failed for ${filename}:`, err.message)
    }
  }

  console.log('\nAll media files downloaded and size variants generated successfully!')
  const files = fs.readdirSync(mediaDir)
  console.log(`Total files in public/media: ${files.length}`)
}

main().catch(console.error)
