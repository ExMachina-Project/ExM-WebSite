import './globals.css'
import SiteNav from '../components/SiteNav.jsx'
import SiteFooter from '../components/SiteFooter.jsx'
import { siteAsset } from '../site.js'

export const metadata = {
  title: 'ExMachina',
  description: 'ExMachina 是本地优先的集体智能编排系统。让专业智能体分工协作，让每个结论带着证据回来，让任务全过程可检查、可追溯。',
  applicationName: 'ExMachina',
  keywords: ['ExMachina', '智械计划', '集体智能', '智能体编排', '可审计 AI'],
  icons: {
    icon: siteAsset('/mark.svg'),
    shortcut: siteAsset('/mark.svg'),
  },
  openGraph: {
    title: 'ExMachina',
    description: '本地优先的集体智能编排系统。让专业智能体分工协作，让每个结论带着证据回来。',
    siteName: 'ExMachina',
    type: 'website',
    locale: 'zh_CN',
  },
  robots: { index: true, follow: true },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#09090b',
  colorScheme: 'dark',
}

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN" data-scroll-behavior="smooth">
      <body>
        <a className="skip-link" href="#main-content">跳到主要内容</a>
        <SiteNav />
        {children}
        <SiteFooter />
      </body>
    </html>
  )
}
