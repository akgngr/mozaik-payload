import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
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
