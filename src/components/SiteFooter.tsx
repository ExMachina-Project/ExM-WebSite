import Link from 'next/link'
import BrandMark from './BrandMark'
import { GITHUB } from '../site'

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="content-wrap">
        <div className="footer-wordmark" aria-hidden="true">EXMACHINA<span>智械计划</span></div>
        <div className="footer-main">
          <Link className="site-brand footer-brand" href="/"><BrandMark className="site-brand-mark" /><span>ExMachina</span></Link>
          <a className="footer-github" href={GITHUB} target="_blank" rel="noreferrer">GitHub ↗</a>
        </div>
        <nav className="footer-navigation" aria-label="页脚导航">
          <Link href="/docs">文档中心</Link>
          <Link href="/docs/installation">安装指南</Link>
          <Link href="/docs/plugins">插件开发</Link>
          <Link href="/plugins">插件市场 <span>即将开放</span></Link>
        </nav>
        <div className="footer-bottom"><span>EXMACHINA · 智械计划</span><span>OPEN SOURCE · MIT LICENSE</span><a href="#main-content">回到顶部 ↑</a></div>
      </div>
    </footer>
  )
}
