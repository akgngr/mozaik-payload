import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['sharp', 'drizzle-kit', '@payloadcms/db-postgres'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  turbopack: {
    resolveAlias: {
      '@payload-config': './src/payload.config.ts',
    },
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
