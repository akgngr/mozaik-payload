/**
 * Fix-up 2: covers for the remaining projects + remove the non-legacy seed project.
 * Run: npx payload run src/seed/fix-covers.ts
 */
import fs from 'fs'
import path from 'path'
import { getPayload } from 'payload'
import config from '@/payload.config'

const MEDIA_DIR = '/tmp/oldsite-media'
const covers: Record<string, string> = JSON.parse(fs.readFileSync('/tmp/oldsite-covers2.json', 'utf-8'))

const run = async () => {
  const payload = await getPayload({ config })

  for (const [slug, file] of Object.entries(covers)) {
    const alt = `Mosaik Projekt – ${slug.replace(/-/g, ' ')}`
    const existing = await payload.find({ collection: 'media', where: { alt: { equals: alt } }, limit: 1 })
    let mediaId: number
    if (existing.docs[0]) {
      mediaId = existing.docs[0].id as number
    } else {
      const doc = await payload.create({
        collection: 'media',
        data: { alt },
        filePath: path.join(MEDIA_DIR, file),
      })
      mediaId = doc.id as number
    }
    const proj = await payload.find({ collection: 'projects', where: { slug: { equals: slug } }, limit: 1 })
    if (!proj.docs[0]) {
      payload.logger.warn(`project not found: ${slug}`)
      continue
    }
    await payload.update({ collection: 'projects', id: proj.docs[0].id, data: { coverImage: mediaId } })
    payload.logger.info(`cover set: ${slug}`)
  }

  // Remove the seed-only project that does not exist on the legacy site
  const aufbruch = await payload.find({
    collection: 'projects',
    where: { slug: { equals: 'projekt-aufbruch' } },
    limit: 1,
  })
  if (aufbruch.docs[0]) {
    await payload.delete({ collection: 'projects', id: aufbruch.docs[0].id })
    payload.logger.info('removed seed-only project: projekt-aufbruch')
  }

  payload.logger.info('Fix-up complete.')
  process.exit(0)
}

try {
  await run()
} catch (err) {
  console.error(err)
  process.exit(1)
}
