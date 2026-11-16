import { DOCUMENTATION } from './data/documentation.js'

export const GITHUB = 'https://github.com/ExMachina-Project/ExMachina'

export const ORIGIN = process.env.NEXT_PUBLIC_SITE_ORIGIN?.replace(/\/$/, '') || ''
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH?.replace(/\/$/, '') || ''

export function siteAsset(path) {
  return `${BASE_PATH}${path}`
}

export function sitePathname(pathname) {
  const path = BASE_PATH && (pathname === BASE_PATH || pathname.startsWith(`${BASE_PATH}/`))
    ? pathname.slice(BASE_PATH.length)
    : pathname
  return path?.replace(/\/$/, '') || '/'
}

export function getInstallCommands(origin) {
  const upstream = 'https://raw.githubusercontent.com/ExMachina-Project/ExMachina/main/scripts'
  const base = origin?.replace(/\/$/, '')
  return {
    unix: base ? `curl -fsSL ${base}/install | sh` : `curl -fsSL ${upstream}/install.sh | bash`,
    windows: `curl -fsSL -o install.bat ${base ? `${base}/install.bat` : `${upstream}/install.bat`}\ninstall.bat`,
  }
}

export const DOCS = DOCUMENTATION.slice(0, 4).map((doc, index) => ({
  id: String(index + 1).padStart(2, '0'), title: doc.title,
  desc: doc.shortDescription, url: `/docs/${doc.slug}`,
}))
