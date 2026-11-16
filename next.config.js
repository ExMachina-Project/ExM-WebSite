const staticExport = process.env.GITHUB_PAGES === 'true'
const basePath = process.env.NEXT_PUBLIC_BASE_PATH?.replace(/\/$/, '') || ''

/** @type {import('next').NextConfig} */
const nextConfig = {
  ...(staticExport ? { output: 'export', trailingSlash: true } : {}),
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
