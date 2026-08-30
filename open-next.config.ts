import { defineCloudflareConfig } from '@opennextjs/cloudflare'

export default defineCloudflareConfig({
  external: {
    packages: ['sharp', 'drizzle-kit', '@payloadcms/db-postgres'],
  },
})
