import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = dirname(dirname(fileURLToPath(import.meta.url)))
const serverDir = join(root, 'dist', 'server')
const entryPath = join(serverDir, 'index.js')
const polyfillTarget = join(serverDir, '__process_polyfill.js')
const polyfillSource = join(root, 'scripts', 'cloudflare-process-polyfill.js')
const wranglerPath = join(serverDir, 'wrangler.json')
const polyfillImport = 'import"./__process_polyfill.js";'
const envMergeSnippet =
  'const __vinextEnvMerge=globalThis.process&&globalThis.process.env;if(__vinextEnvMerge&&t)for(const s in t){const v=t[s];if(typeof v===`string`)__vinextEnvMerge[s]=v;}'
const fetchSignature = 'async fetch(e,t,n){'

if (!existsSync(entryPath)) {
  console.error('postbuild-cloudflare: dist/server/index.js not found. Run `vinext build` first.')
  process.exit(1)
}

writeFileSync(polyfillTarget, readFileSync(polyfillSource, 'utf8'))

let entry = readFileSync(entryPath, 'utf8')
let changed = false

if (!entry.includes('__process_polyfill.js')) {
  entry = polyfillImport + entry
  console.log('postbuild-cloudflare: injected process polyfill import into dist/server/index.js')
  changed = true
}

if (!entry.includes('__vinextEnvMerge')) {
  if (!entry.includes(fetchSignature)) {
    console.error('postbuild-cloudflare: fetch handler signature not found, env merge skipped')
    process.exit(1)
  }
  entry = entry.replace(fetchSignature, fetchSignature + envMergeSnippet)
  console.log('postbuild-cloudflare: injected worker env merge into fetch handler')
  changed = true
}

if (changed) writeFileSync(entryPath, entry)

if (existsSync(wranglerPath)) {
  const config = JSON.parse(readFileSync(wranglerPath, 'utf8'))
  const flags = config.compatibility_flags ?? (config.compatibility_flags = [])
  let flagsChanged = false
  for (const flag of ['enable_nodejs_fs_module', 'nodejs_compat_populate_process_env']) {
    if (!flags.includes(flag)) {
      flags.push(flag)
      flagsChanged = true
      console.log(`postbuild-cloudflare: added ${flag} to dist/server/wrangler.json`)
    }
  }
  if (flagsChanged) writeFileSync(wranglerPath, JSON.stringify(config))
}
