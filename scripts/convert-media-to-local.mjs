import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')

const backupPath = path.resolve(rootDir, 'neon_backup_mosaik.sql')
let sql = fs.readFileSync(backupPath, 'utf8')

// Replace Cloudinary URLs with local /media/ URLs in media table inserts
// Matches: 'https://res.cloudinary.com/xosgweuf/image/upload/[^']+' -> '/media/[filename]'
const lines = sql.split('\n')
let updatedCount = 0

const newLines = lines.map((line) => {
  if (line.startsWith('INSERT INTO "media"')) {
    updatedCount++
    // 1. Extract filename: the 7th column in the values (after url, thumbnail_url)
    // In our dump: VALUES (id, alt, updated_at, created_at, url, thumbnail_u_r_l, filename, ...)
    const fnMatch = line.match(/,\s*'([^']+\.(jpg|png|jpeg|webp))'/i)
    const filename = fnMatch ? fnMatch[1] : null

    // Replace Cloudinary URL with /media/<filename>
    let updatedLine = line.replace(
      /'https:\/\/res\.cloudinary\.com\/[^']+'/g,
      filename ? `'/media/${filename}'` : `'/media/'`
    )

    // Replace /api/media/file/ with /media/
    updatedLine = updatedLine.replace(/\/api\/media\/file\//g, '/media/')

    // Replace cloudinary_public_id at the end of the VALUES with NULL
    updatedLine = updatedLine.replace(/,\s*'mosaik\/[a-f0-9]+'\)\s*ON CONFLICT/g, `, NULL) ON CONFLICT`)

    return updatedLine
  }
  return line
})

fs.writeFileSync(backupPath, newLines.join('\n'), 'utf8')
console.log(`Updated ${updatedCount} media records in neon_backup_mosaik.sql to use local /media/ paths!`)
