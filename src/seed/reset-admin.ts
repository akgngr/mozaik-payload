/**
 * Reset the admin user password (one-off).
 * Run: npx payload run src/seed/reset-admin.ts
 */
import { getPayload } from 'payload'
import config from '@/payload.config'

const run = async () => {
  const payload = await getPayload({ config })
  await payload.update({
    collection: 'users',
    id: 1,
    data: { password: 'Mosaik2026!' },
  })
  payload.logger.info('password updated for user 1')
  process.exit(0)
}

try {
  await run()
} catch (err) {
  console.error(err)
  process.exit(1)
}
