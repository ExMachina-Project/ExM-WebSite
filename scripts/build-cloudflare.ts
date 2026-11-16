import { createRequire } from 'node:module'
import { spawnSync } from 'node:child_process'

const require = createRequire(import.meta.url)
const result = spawnSync(process.execPath, [require.resolve('next/dist/bin/next'), 'build'], {
  stdio: 'inherit',
  env: {
    ...process.env,
    CLOUDFLARE_PAGES: 'true',
    GITHUB_PAGES: 'false',
    NEXT_PUBLIC_BASE_PATH: '',
  },
})

if (result.error) throw result.error
process.exit(result.status ?? 1)
