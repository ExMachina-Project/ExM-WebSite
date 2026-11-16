import Link from 'next/link'

export default function NotFound() {
  return <main className="site-not-found content-wrap" id="main-content"><span className="section-eyebrow">404 / PAGE NOT FOUND</span><h1>这一页还没有记录。</h1><p>路径可能已调整。回到首页，或从文档目录继续阅读。</p><div className="plugins-actions"><Link className="page-button page-button--primary" href="/">回到首页 ↗</Link><Link className="page-button" href="/docs">查看文档 ↗</Link></div></main>
}
