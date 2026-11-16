import './globals.css'
import type { Metadata, Viewport } from 'next'
import SiteNav from '../components/SiteNav'
import SiteFooter from '../components/SiteFooter'
import { siteAsset } from '../site'

export const metadata: Metadata = {
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

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#09090b',
  colorScheme: 'dark',
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
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
