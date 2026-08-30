import { defineCloudflareConfig } from '@opennextjs/cloudflare'

export default defineCloudflareConfig({
  // Mark native/problematic modules as external so esbuild doesn't try to bundle them
  esbuildOptions: (options) => ({
    ...options,
    plugins: [
      ...(options.plugins ?? []),
      {
        name: 'mark-problematic-modules-external',
        setup(build) {
          // sharp and its Turbopack-hashed variants (e.g. sharp-20c6a5da84e2135f)
          build.onResolve({ filter: /^sharp(-[a-f0-9]+)?$/ }, () => ({
            external: true,
          }))
          // jose: workerd export condition points to non-existent file
          build.onResolve({ filter: /^jose$/ }, () => ({
            external: true,
          }))
          // pg-cloudflare: Cloudflare TCP socket adapter for pg
          build.onResolve({ filter: /^pg-cloudflare$/ }, () => ({
            external: true,
          }))
        },
      },
    ],
  }),
})
