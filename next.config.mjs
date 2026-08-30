import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['sharp', 'drizzle-kit', '@payloadcms/db-postgres'],
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Force webpack instead of Turbopack for OpenNext compatibility
  turbopack: undefined,
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
