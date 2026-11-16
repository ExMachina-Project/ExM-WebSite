import type { NextConfig } from 'next'

const staticExport = process.env.GITHUB_PAGES === 'true'
  || process.env.CLOUDFLARE_PAGES === 'true'
  || process.env.CF_PAGES === '1'
const basePath = process.env.NEXT_PUBLIC_BASE_PATH?.replace(/\/$/, '') || ''

const nextConfig: NextConfig = {
  ...(staticExport ? { output: 'export', trailingSlash: true } : {}),
  typedRoutes: true,
  basePath,
  allowedDevOrigins: ['192.168.2.242'],
  devIndicators: false,
  ...(!staticExport && {
    outputFileTracingIncludes: {
      '/install': ['./install'],
      '/install.bat': ['./install.bat'],
    },
  }),
}

export default nextConfig
